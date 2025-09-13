import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { getFoundationCount } from './redis-helper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, paymentType = 'foundation' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    // Check Foundation tier availability
    const foundationCount = await getFoundationCount(redis);
    const isFoundationAvailable = foundationCount < 100;

    let sessionConfig;
    let tierInfo;

    if (paymentType === 'foundation' && isFoundationAvailable) {
      // Foundation tier: €29
      tierInfo = {
        name: 'Signal/Noise - Foundation Access',
        description: 'Foundation member - lifetime access to AI Coach and all features',
        amount: 2900, // €29.00 in cents
        tier: 'foundation'
      };
    } else {
      // Early Adopter tier: €49
      tierInfo = {
        name: 'Signal/Noise - Early Adopter',
        description: 'Early adopter - lifetime access to AI Coach and all features',
        amount: 4900, // €49.00 in cents
        tier: 'early_adopter'
      };
    }

    sessionConfig = {
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: tierInfo.name,
              description: tierInfo.description,
              images: [`${baseUrl}/android-launchericon-512-512.png`],
            },
            unit_amount: tierInfo.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        payment_type: 'lifetime',
        tier: tierInfo.tier,
        first_name: firstName || '',
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?cancelled=true`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      tier: tierInfo.tier,
      price: tierInfo.amount / 100,
      foundationSpotsLeft: isFoundationAvailable ? 100 - parseInt(foundationCount) : 0
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session'
    });
  }
}