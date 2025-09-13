import { loadStripe } from '@stripe/stripe-js';

export default function PremiumBanner() {
  const handleUpgrade = async () => {
    // Option A: Simple Payment Link (Empfohlen für Go-Live)
    // window.location.href = 'https://buy.stripe.com/YOUR_LINK';

    // Option B: Embedded Checkout
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    if (!stripe) {
      alert('Stripe konnte nicht geladen werden');
      return;
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1OxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxGQ9fhskip', // Replace with actual price ID
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/?success=true`,
      cancelUrl: `${window.location.origin}/?canceled=true`,
    });

    if (error) {
      console.error('Stripe Checkout error:', error);
      alert('Fehler beim Öffnen des Zahlungsformulars');
    }
  };

  return (
    <div className="premium-banner">
      <div className="premium-title">Groq Intelligence</div>
      <div className="premium-features">
        KI-Analyse • Persönliche Patterns • Team-Vergleich
      </div>
      <button
        onClick={handleUpgrade}
        className="premium-cta"
      >
        7 Tage kostenlos testen
      </button>
    </div>
  );
}