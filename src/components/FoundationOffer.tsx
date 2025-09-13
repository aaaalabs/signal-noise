import { useState, useEffect } from 'react';

interface FoundationStats {
  foundationMembers: number;
  spotsLeft: number;
  totalSpots: number;
  isAvailable: boolean;
  currentTier: 'foundation' | 'early_adopter';
  currentPrice: number;
}

interface FoundationOfferProps {
  onPurchase: (email: string, firstName?: string) => void;
}

export default function FoundationOffer({ onPurchase }: FoundationOfferProps) {
  const [stats, setStats] = useState<FoundationStats | null>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoundationStats();
    const interval = setInterval(fetchFoundationStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchFoundationStats = async () => {
    try {
      const response = await fetch('/api/foundation-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch foundation stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await onPurchase(email.trim(), firstName.trim() || undefined);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-8">
        {/* Logo/Title */}
        <h1 className="text-2xl font-light mb-8 tracking-wide">Signal/Noise</h1>

        {/* Main Value Proposition */}
        <div className="mb-8">
          <div className="text-6xl font-thin mb-2 text-white">80/20</div>
          <div className="text-sm text-gray-400 font-light">Focus on what matters</div>
        </div>

        {/* Feature List - Minimal */}
        <div className="space-y-3 mb-8 text-sm text-gray-400 font-light">
          <div>AI Coach included</div>
          <div>Lifetime updates</div>
          <div>No subscription</div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <div className="text-2xl font-light text-white">
            €{stats.currentPrice}
          </div>
          <div className="text-xs text-gray-500 font-light">
            {stats.isAvailable ? 'Foundation Access' : 'Early Adopter'}
          </div>
        </div>

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-3 text-sm
                       focus:border-gray-600 focus:outline-none transition-colors duration-300
                       placeholder-gray-600"
            required
          />

          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-3 text-sm
                       focus:border-gray-600 focus:outline-none transition-colors duration-300
                       placeholder-gray-600"
          />

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full border border-gray-800 py-3 text-sm font-light
                       hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-300"
          >
            {loading ? 'Processing...' : 'Continue with purchase'}
          </button>
        </form>

        {/* Foundation Counter - Subtle */}
        <div className="text-xs text-gray-600 font-light">
          {stats.isAvailable ? (
            <>
              {stats.foundationMembers} of {stats.totalSpots} Foundation members
              <div className="mt-2 h-px bg-gray-900">
                <div
                  className="h-px bg-gray-700 transition-all duration-1000"
                  style={{ width: `${(stats.foundationMembers / stats.totalSpots) * 100}%` }}
                />
              </div>
            </>
          ) : (
            `Foundation tier complete - ${stats.foundationMembers} members joined`
          )}
        </div>

        {/* Minimal timeline info */}
        {stats.isAvailable && (
          <div className="mt-6 text-xs text-gray-700 font-light">
            Foundation pricing available through January
          </div>
        )}
      </div>
    </div>
  );
}