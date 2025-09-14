import { Redis } from '@upstash/redis';
import { getUser, setUser, incrementFoundation, generateInvoiceNumber, setInvoice, generateInvoiceToken } from './redis-helper.js';
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

    // Check if user already exists (means primary webhook succeeded)
    const existingUser = await getUser(redis, email);
    if (existingUser && Object.keys(existingUser).length > 0) {
      console.log(`✅ User ${email} already exists (primary webhook succeeded), skipping backup creation`);
      console.log(`📄 User has invoice: ${existingUser.invoice_number || 'none'}`);
      return res.status(200).json({
        message: 'User already exists - primary webhook succeeded',
        alreadyExists: true,
        source: 'primary_webhook',
        hasInvoice: !!existingUser.invoice_number
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
      await incrementFoundation(redis);
    }

    // Generate invoice for this payment
    const invoiceNumber = await generateInvoiceNumber(redis);
    const invoiceDate = new Date().toLocaleDateString('en-US');

    // Generate secure invoice token
    const invoiceToken = await generateInvoiceToken(invoiceNumber, email);

    // Create invoice data structure
    const invoiceData = {
      invoiceNumber: invoiceNumber,
      customerEmail: email,
      customerName: session.customer_details?.name || 'Signal/Noise Member',
      tier: tier,
      amount: (session.amount_total / 100).toString(),
      invoiceDate: invoiceDate,
      paymentDate: invoiceDate,
      paymentMethod: 'Stripe (Kreditkarte/SEPA)',
      date: invoiceDate,
      dueDate: invoiceDate, // Lifetime payment, already paid

      items: [{
        description: tier === 'foundation' ? 'Signal/Noise Foundation Member Access' : 'Signal/Noise Early Adopter Access',
        quantity: 1,
        unitPrice: (session.amount_total / 100),
        totalPrice: (session.amount_total / 100),
        vatRate: 0
      }],

      subtotal: (session.amount_total / 100),
      totalAmount: (session.amount_total / 100),
      totalVat: 0,

      // Add secure link
      secureLink: `https://signal-noise.app/invoice/secure/${invoiceToken}`,
      invoiceLink: `https://signal-noise.app/invoice/secure/${invoiceToken}`
    };

    // Store invoice in Redis
    await setInvoice(redis, invoiceNumber, invoiceData, invoiceToken);

    // Update user record with invoice info
    await setUser(redis, email, {
      invoice_number: invoiceNumber,
      invoice_token: invoiceToken,
      invoice_date: invoiceDate
    });

    // Send welcome email with invoice details
    const firstName = session.customer_details?.name?.split(' ')[0] || 'Member';
    const tierName = tier === 'foundation' ? 'Foundation Member' : 'Early Adopter';
    const emailResult = await sendWelcomeEmail(email, firstName, tierName, invoiceNumber, invoiceToken);

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