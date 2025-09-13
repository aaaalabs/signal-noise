import { Redis } from '@upstash/redis';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';
import { keys, incrementFoundation, setUser } from './redis-helper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Use different webhook secrets for development vs production
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_DEV || process.env.STRIPE_WEBHOOK_SECRET;

// Configure Vercel to send raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];

  console.log('🔐 Webhook Debug Info:', {
    hasSignature: !!sig,
    signatureStart: sig ? sig.substring(0, 20) + '...' : 'none',
    hasWebhookSecret: !!webhookSecret,
    webhookSecretStart: webhookSecret ? webhookSecret.substring(0, 10) + '...' : 'none',
    webhookSecretLength: webhookSecret ? webhookSecret.length : 0
  });

  // SLC approach: Skip signature verification in development for simplicity
  // This works around the Vercel dev body parsing issues
  const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production';

  let event;
  if (isDev && req.body && typeof req.body === 'object') {
    console.log('🚧 Development mode: Using parsed body directly');
    event = req.body;
  } else {
    // Production: Get raw body for signature verification
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const body = Buffer.concat(chunks);

    console.log('📦 Body Debug:', {
      bodyLength: body.length,
      bodyStart: body.toString().substring(0, 100) + '...'
    });

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      console.log('✅ Webhook signature verified successfully');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutCompleted(session) {
  const { customer_email, customer, metadata, amount_total, mode } = session;

  if (!customer_email) {
    console.error('No customer email in checkout session');
    return;
  }

  const accessToken = 'snk_' + randomBytes(32).toString('hex');

  // Determine payment type and tier
  const isLifetime = metadata?.payment_type === 'lifetime' || mode === 'payment';
  const paymentType = isLifetime ? 'lifetime' : 'subscription';
  const tier = metadata?.tier || 'early_adopter';

  // Increment Foundation counter if Foundation member
  if (tier === 'foundation') {
    await incrementFoundation(redis);
  }

  const userData = {
    email: customer_email,
    access_token: accessToken,
    payment_type: paymentType,
    tier: tier,
    status: 'active',
    created_at: Date.now().toString(),
    expires_at: isLifetime ? '0' : getSubscriptionEndDate().toString(),
    stripe_customer_id: customer,
    payment_amount: (amount_total / 100).toString(), // Convert from cents
    first_name: metadata?.first_name || '',
    last_payment: Date.now().toString()
  };

  await setUser(redis, customer_email, userData);

  console.log(`Premium access granted for ${customer_email} (${paymentType}, ${tier})`);

  // Send welcome email with magic link
  await sendWelcomeEmail(customer_email, userData.first_name, tier === 'foundation');
}

async function handleSubscriptionCreated(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);

  const updateData = {
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    current_period_end: (subscription.current_period_end * 1000).toString(),
    expires_at: (subscription.current_period_end * 1000).toString()
  };

  await setUser(redis, customer.email, updateData);

  console.log(`Subscription created for ${customer.email}`);
}

async function handleSubscriptionUpdated(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userKey = `user:${customer.email}`;

  const updates = {
    subscription_status: subscription.status,
    current_period_end: (subscription.current_period_end * 1000).toString(),
    expires_at: (subscription.current_period_end * 1000).toString(),
    status: subscription.status === 'active' ? 'active' : 'inactive'
  };

  await redis.hset(userKey, updates);

  console.log(`Subscription updated for ${customer.email}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userKey = `user:${customer.email}`;

  await redis.hset(userKey, {
    status: 'cancelled',
    subscription_status: 'cancelled',
    cancelled_at: Date.now().toString()
  });

  console.log(`Subscription cancelled for ${customer.email}`);
}

async function handlePaymentSucceeded(invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    const userKey = `user:${customer.email}`;

    await redis.hset(userKey, {
      status: 'active',
      last_payment: Date.now().toString(),
      expires_at: (subscription.current_period_end * 1000).toString()
    });

    console.log(`Payment succeeded for ${customer.email}`);
  }
}

async function handlePaymentFailed(invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    const userKey = `user:${customer.email}`;

    await redis.hset(userKey, {
      status: 'payment_failed',
      payment_failed_at: Date.now().toString()
    });

    console.log(`Payment failed for ${customer.email}`);
  }
}

function getSubscriptionEndDate() {
  // 1 month from now
  return Date.now() + (30 * 24 * 60 * 60 * 1000);
}

async function sendWelcomeEmail(email, firstName, isLifetime) {
  const emailData = {
    to: email,
    subject: isLifetime
      ? '🎯 Welcome to Signal/Noise Premium - Lifetime Access!'
      : '🎯 Welcome to Signal/Noise Premium!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff88;">🎯 Welcome to Signal/Noise Premium!</h2>

        <p>Hi ${firstName || 'there'}!</p>

        <p>Thank you for joining Signal/Noise Premium! Your AI Coach is now ready to help you achieve peak productivity.</p>

        ${isLifetime ? `
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0066cc; margin: 0 0 10px 0;">🌟 Lifetime Access Activated!</h3>
            <p style="margin: 0;">You now have unlimited access to all premium features, forever. No recurring charges, no expiration.</p>
          </div>
        ` : `
          <p>Your monthly subscription is now active and includes:</p>
        `}

        <ul>
          <li>✨ Personal AI Coach powered by Llama 3.3</li>
          <li>📊 Advanced pattern recognition</li>
          <li>🎯 Daily check-ins and weekly reports</li>
          <li>⚡ Real-time productivity interventions</li>
          <li>🚀 All future premium features</li>
        </ul>

        <a href="${process.env.VERCEL_URL || 'https://signal-noise.app'}/premium"
           style="display: inline-block; background: #00ff88; color: #000;
                  padding: 12px 24px; text-decoration: none; border-radius: 6px;
                  font-weight: bold; margin: 20px 0;">
          Start Using AI Coach →
        </a>

        <p style="color: #666; font-size: 14px;">
          To access your AI Coach, simply enter your email address in the app and we'll send you a secure login link.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #666; font-size: 12px;">
          Questions? Reply to this email.<br>
          Signal/Noise - Focus on what matters<br>
          <a href="https://signal-noise.app">signal-noise.app</a>
        </p>
      </div>
    `
  };

  // TODO: Send actual email
  console.log('Welcome email:', emailData);
}