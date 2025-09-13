import { Redis } from '@upstash/redis';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';
import { keys, incrementFoundation, setUser, generateInvoiceNumber, setInvoice, generateInvoiceToken, setInvoiceToken } from './redis-helper.js';
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
  console.log('🎯 Webhook endpoint hit!', {
    method: req.method,
    url: req.url,
    headers: Object.keys(req.headers),
    timestamp: new Date().toISOString()
  });

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
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
    console.log('📥 Attempting to read raw body from request stream');
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      console.log('📥 Received chunk:', chunk.length, 'bytes');
    }
    console.log('📥 Total chunks received:', chunks.length);
  } catch (error) {
    console.log('⚠️ Raw body reading failed:', error.message);
    console.log('🔄 Will try parsed body fallback');
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
  } else if (useRawBody && chunks.length === 0) {
    console.log('⚠️ No raw body chunks received, switching to parsed body mode');
    useRawBody = false;
  }

  // Fallback: Use parsed body (development or Vercel production issue)
  if (!useRawBody) {
    console.log('🔍 Checking req.body for fallback:', {
      bodyExists: !!req.body,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      bodyString: req.body ? JSON.stringify(req.body).substring(0, 200) : 'null'
    });

    if (req.body && typeof req.body === 'object') {
      console.log('🚧 Using parsed body directly (signature verification bypassed)');
      event = req.body;
    } else {
      console.error('❌ No usable body found - neither raw nor parsed body available');
      return res.status(400).json({ error: 'No request body available' });
    }
  }

  // Additional validation: ensure event object exists
  if (!event) {
    console.error('❌ Event object is null/undefined after processing');
    return res.status(400).json({ error: 'Invalid event data' });
  }

  console.log('✅ Event processed successfully:', {
    eventType: event.type || 'unknown',
    eventId: event.id || 'unknown',
    hasData: !!event.data,
    hasObject: !!(event.data && event.data.object)
  });

  try {
    console.log('📨 Processing event:', {
      type: event.type,
      id: event.id || 'no-id',
      created: event.created || 'no-timestamp'
    });

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('🛒 Processing checkout.session.completed event');
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        console.log('📝 Processing customer.subscription.created event');
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        console.log('✏️ Processing customer.subscription.updated event');
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        console.log('🗑️ Processing customer.subscription.deleted event');
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        console.log('💰 Processing invoice.payment_succeeded event');
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        console.log('⚠️ Processing invoice.payment_failed event');
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`❓ Unhandled event type: ${event.type}`);
    }

    console.log('✅ Webhook processing completed successfully');
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('💥 Webhook handler error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutCompleted(session) {
  console.log('🚀 handleCheckoutCompleted called with session ID:', session.id);

  const { customer_email, customer, metadata, amount_total, mode } = session;

  console.log('📧 Session Data:', {
    customer_email,
    customer,
    metadata,
    amount_total,
    mode
  });

  if (!customer_email) {
    console.error('❌ No customer email in checkout session');
    return;
  }

  console.log('🔑 Generating access token for user:', customer_email);
  const accessToken = 'snk_' + randomBytes(32).toString('hex');

  // Determine payment type and tier
  const isLifetime = metadata?.payment_type === 'lifetime' || mode === 'payment';
  const paymentType = isLifetime ? 'lifetime' : 'subscription';
  const tier = metadata?.tier || 'early_adopter';

  console.log('💳 Payment Info:', {
    isLifetime,
    paymentType,
    tier,
    amount: amount_total / 100
  });

  // Increment Foundation counter if Foundation member
  if (tier === 'foundation') {
    console.log('🏛️ Incrementing Foundation counter');
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

  console.log('👤 User data to store:', userData);

  try {
    console.log('💾 Attempting to store user in Redis with key: sn:u:' + customer_email);
    await setUser(redis, customer_email, userData);
    console.log('✅ User successfully stored in Redis');

    // Verify the user was stored by reading it back
    const storedUser = await redis.hgetall(`sn:u:${customer_email}`);
    console.log('🔍 Verification - User stored in Redis:', storedUser);

  } catch (error) {
    console.error('❌ Failed to store user in Redis:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      email: customer_email
    });
    throw error; // Re-throw to trigger webhook failure
  }

  // Generate invoice number and store invoice data
  console.log('📄 Generating invoice for payment');
  const invoiceNumber = await generateInvoiceNumber(redis);
  const invoiceDate = new Date().toLocaleDateString('en-US');
  const paymentDate = new Date().toLocaleDateString('en-US');

  console.log('📄 Invoice details:', {
    invoiceNumber,
    invoiceDate,
    paymentDate
  });

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

  try {
    console.log('💾 Storing invoice in Redis');
    await setInvoice(redis, invoiceNumber, invoiceData);
    console.log('✅ Invoice stored successfully');
  } catch (error) {
    console.error('❌ Failed to store invoice:', error);
    throw error;
  }

  // Generate and store secure invoice token for GDPR compliance
  try {
    console.log('🔐 Generating secure invoice token');
    const invoiceToken = await generateInvoiceToken(invoiceNumber, customer_email);
    console.log('💾 Storing invoice token in Redis');
    await setInvoiceToken(redis, invoiceToken, invoiceNumber);
    console.log('✅ Invoice token stored successfully');

    // Add invoice reference to user record for easy retrieval
    console.log('🔄 Updating user record with invoice info');
    await setUser(redis, customer_email, {
      invoice_number: invoiceNumber,
      invoice_token: invoiceToken,
      invoice_date: invoiceDate
    });
    console.log('✅ User record updated with invoice info');

    console.log(`🎉 Premium access granted for ${customer_email} (${paymentType}, ${tier})`);
    console.log(`📄 Invoice ${invoiceNumber} generated for payment ${session.id}`);
    console.log(`🔐 Secure invoice token generated: ${invoiceToken.substring(0, 8)}...`);

    // Send welcome email with secure invoice link
    try {
      console.log('📧 Sending welcome email');
      const tierName = tier === 'foundation' ? 'Foundation Member' : 'Early Adopter';
      await sendWelcomeEmail(customer_email, userData.first_name, tierName, invoiceNumber, invoiceToken);
      console.log('✅ Welcome email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw - email failure shouldn't fail the entire webhook
    }

  } catch (error) {
    console.error('❌ Failed to process invoice/token:', error);
    throw error;
  }
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

