import Stripe from 'stripe';

// Clean the Stripe secret key to remove any whitespace/newlines
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = new Stripe(stripeSecretKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id required' });
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Only return basic information if the session was completed
    if (session.payment_status === 'paid' && session.status === 'complete') {
      return res.status(200).json({
        email: session.customer_email,
        status: 'complete',
        payment_status: 'paid',
        amount: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
        created: session.created
      });
    } else {
      return res.status(400).json({
        error: 'Session not completed or payment not successful',
        status: session.status,
        payment_status: session.payment_status
      });
    }

  } catch (error) {
    console.error('Session retrieval error:', error);

    if (error.code === 'resource_missing') {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.status(500).json({ error: 'Failed to retrieve session' });
  }
}