import FoundationOffer from './FoundationOffer';

interface PremiumLandingProps {
  onBack: () => void;
}

export default function PremiumLanding({ onBack }: PremiumLandingProps) {
  const handlePurchase = async (email: string, firstName?: string) => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          paymentType: 'foundation'
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to start purchase. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Back button - Ive style */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-xs text-gray-500 hover:text-gray-300
                   transition-colors duration-300 z-10"
      >
        ← Back
      </button>

      <FoundationOffer onPurchase={handlePurchase} />
    </div>
  );
}