import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, paymentType = 'lifetime' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    let sessionConfig;

    if (paymentType === 'lifetime') {
      // One-time payment for lifetime access
      sessionConfig = {
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Signal/Noise Premium - Lifetime Access',
                description: 'One-time payment for lifetime access to AI Coach and all premium features',
                images: [`${baseUrl}/android-launchericon-512-512.png`],
              },
              unit_amount: 4900, // €49.00 in cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          payment_type: 'lifetime',
          first_name: firstName || '',
        },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing?cancelled=true`,
      };
    } else {
      // Subscription
      sessionConfig = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Signal/Noise Premium - Monthly',
                description: 'Monthly subscription to AI Coach and premium features',
                images: [`${baseUrl}/android-launchericon-512-512.png`],
              },
              unit_amount: 900, // €9.00 in cents
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          payment_type: 'subscription',
          first_name: firstName || '',
        },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing?cancelled=true`,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session'
    });
  }
}