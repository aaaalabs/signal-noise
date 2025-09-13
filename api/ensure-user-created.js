import { Redis } from '@upstash/redis';
import { getUser, setUser, incrementFoundationCount } from './redis-helper.js';
import { sendWelcomeEmail } from './email-helper.js';
import Stripe from 'stripe';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, sessionId, source } = req.body;

  if (!email || !sessionId) {
    return res.status(400).json({ error: 'Email and sessionId required' });
  }

  // Skip test emails to avoid database pollution
  if (email.includes('@example.com') || email.includes('test@')) {
    console.log(`🚫 Skipping test email: ${email}`);
    return res.status(200).json({
      message: 'Test email skipped',
      testEmail: true
    });
  }

  try {
    console.log(`Backup user creation for ${email} (${source})`);

    // Check if user already exists
    const existingUser = await getUser(redis, email);
    if (existingUser && Object.keys(existingUser).length > 0) {
      console.log(`✅ User ${email} already exists (webhook succeeded), skipping backup creation`);
      return res.status(200).json({
        message: 'User already exists - webhook succeeded',
        alreadyExists: true,
        source: 'webhook'
      });
    }

    // Get session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Invalid or unpaid session' });
    }

    // Determine tier based on amount
    const tier = session.amount_total <= 2900 ? 'foundation' : 'early_adopter'; // 29.00 EUR = 2900 cents

    // Create user in Redis
    const userData = {
      email: email,
      tier: tier,
      sessionId: sessionId,
      status: 'active',
      createdAt: new Date().toISOString(),
      source: source || 'backup_creation'
    };

    await setUser(redis, email, userData);

    // Increment foundation counter if foundation tier
    if (tier === 'foundation') {
      await incrementFoundationCount(redis);
    }

    // Send welcome email
    const firstName = session.customer_details?.name?.split(' ')[0] || 'Member';
    const emailResult = await sendWelcomeEmail(email, firstName, tier);

    console.log(`✅ Backup user creation successful for ${email} (${tier})`);

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      tier: tier,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Backup user creation error:', error);
    return res.status(500).json({
      error: 'Failed to create user',
      details: error.message
    });
  }
}