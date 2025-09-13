import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

// Stripe webhook endpoint secret (set in Vercel environment variables)
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    // For MVP: Simple signature verification (in production, use Stripe's SDK)
    // This is a simplified version - replace with proper Stripe webhook verification
    const event = JSON.parse(body);

    // Handle subscription creation/payment success
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;

      if (customerEmail) {
        // Store premium activation in Vercel KV
        const activationKey = `premium:${customerEmail}`;
        const activationData = {
          email: customerEmail,
          activatedAt: new Date().toISOString(),
          subscriptionId: session.subscription || session.id,
          status: 'active'
        };

        await kv.set(activationKey, activationData);

        // Also store a lookup by subscription ID
        if (session.subscription) {
          await kv.set(`sub:${session.subscription}`, customerEmail);
        }

        console.log(`Premium activated for ${customerEmail}`);
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerEmail = await kv.get(`sub:${subscription.id}`);

      if (customerEmail) {
        const activationKey = `premium:${customerEmail}`;
        await kv.del(activationKey);
        await kv.del(`sub:${subscription.id}`);

        console.log(`Premium deactivated for ${customerEmail}`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Export for API route
export { handler as POST };