import React from 'react';
import FoundationOffer from './FoundationOffer';
import ErrorBoundary from './ErrorBoundary';

interface PremiumLandingProps {
  onBack: () => void;
}

export default function PremiumLanding({ onBack }: PremiumLandingProps) {
  // Clean URL when component mounts
  React.useEffect(() => {
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);

      // Dev environment - show what would happen
      if (window.location.hostname === 'localhost') {
        alert(`DEV MODE: Would redirect to Stripe checkout for ${email} - €29 Foundation`);
        return;
      }

      alert('Failed to start purchase. Please try again.');
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative">
        {/* Back button - Ive style */}
        <button
          onClick={onBack}
          className="absolute top-8 left-8 text-xs text-gray-500 hover:text-gray-300
                     transition-colors duration-300 z-10 font-light tracking-wide"
        >
          ← Back
        </button>

        <FoundationOffer onPurchase={handlePurchase} />
      </div>
    </ErrorBoundary>
  );
}