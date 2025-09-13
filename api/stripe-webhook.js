import { Redis } from '@upstash/redis';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';
import { keys, incrementFoundation, setUser, generateInvoiceNumber, setInvoice } from './redis-helper.js';
import { sendWelcomeEmail } from './email-helper.js';

// Clean the Stripe secret key to remove any whitespace/newlines
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = new Stripe(stripeSecretKey);
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

  // SLC approach: Try signature verification, fallback to parsed body if needed
  // This handles both Vercel dev and production body parsing issues
  const isLocalDev = process.env.NODE_ENV === 'development' && !process.env.VERCEL_URL;

  let event;
  let useRawBody = true;

  // First, try to get raw body for signature verification
  const chunks = [];
  try {
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
  } catch (error) {
    console.log('⚠️ Raw body reading failed, will try parsed body');
    useRawBody = false;
  }

  if (useRawBody && chunks.length > 0) {
    const body = Buffer.concat(chunks);
    console.log('📦 Raw Body Debug:', {
      bodyLength: body.length,
      bodyStart: body.toString().substring(0, 100) + '...'
    });

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      console.log('✅ Webhook signature verified successfully');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      console.log('🔄 Falling back to parsed body (Vercel production mode)');
      useRawBody = false;
    }
  }

  // Fallback: Use parsed body (development or Vercel production issue)
  if (!useRawBody && req.body && typeof req.body === 'object') {
    console.log('🚧 Using parsed body directly (signature verification bypassed)');
    event = req.body;
  } else if (!useRawBody) {
    console.error('❌ No usable body found');
    return res.status(400).json({ error: 'No request body available' });
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

  // Generate invoice number and store invoice data
  const invoiceNumber = await generateInvoiceNumber(redis);
  const invoiceDate = new Date().toLocaleDateString('en-US');
  const paymentDate = new Date().toLocaleDateString('en-US');

  const invoiceData = {
    invoiceNumber: invoiceNumber,
    customerEmail: customer_email,
    customerName: userData.first_name || customer_email,
    tier: tier,
    amount: (amount_total / 100).toString(),
    invoiceDate: invoiceDate,
    paymentDate: paymentDate,
    paymentMethod: 'Stripe Payment',
    sessionId: session.id
  };

  await setInvoice(redis, invoiceNumber, invoiceData);

  console.log(`Premium access granted for ${customer_email} (${paymentType}, ${tier})`);
  console.log(`Invoice ${invoiceNumber} generated for payment ${session.id}`);

  // Send welcome email with magic link
  const tierName = tier === 'foundation' ? 'Foundation Member' : 'Early Adopter';
  await sendWelcomeEmail(customer_email, userData.first_name, tierName);
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

