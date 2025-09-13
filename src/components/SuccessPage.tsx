import { useEffect, useState } from 'react';

interface SuccessPageProps {
  onContinue: () => void;
}

export default function SuccessPage({ onContinue }: SuccessPageProps) {
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Fetch session details from Stripe
      fetchSessionDetails(sessionId);
    }
  }, []);

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      // In a real implementation, you'd call your backend to get session details
      // For now, just show a success message
      setSessionDetails({ tier: 'foundation', amount: 29 });
      console.log('Session ID:', sessionId); // Temporary to avoid unused warning
    } catch (error) {
      console.error('Failed to fetch session details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 text-center">
        {/* Simple success indicator */}
        <div className="mb-8">
          <div className="text-6xl font-thin mb-4">✓</div>
          <h1 className="text-2xl font-light mb-2">Welcome to Signal/Noise</h1>
          <div className="text-sm text-gray-400 font-light">
            Premium access activated
          </div>
        </div>

        {/* Simple instructions */}
        <div className="space-y-4 mb-8 text-sm text-gray-400 font-light">
          <div>Check your email for access instructions</div>
          <div>Your AI Coach is ready</div>
          <div>All features unlocked</div>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full border border-gray-800 py-3 text-sm font-light
                     hover:bg-gray-900 transition-colors duration-300"
        >
          Start using Signal/Noise
        </button>

        {/* Subtle foundation badge if applicable */}
        {sessionDetails?.tier === 'foundation' && (
          <div className="mt-6 text-xs text-gray-600 font-light">
            Foundation Member
          </div>
        )}
      </div>
    </div>
  );
}