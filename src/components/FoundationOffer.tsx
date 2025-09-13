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
    // In dev mode, skip API and use fallback immediately
    if (window.location.hostname === 'localhost') {
      setStats({
        foundationMembers: 0,
        spotsLeft: 100,
        totalSpots: 100,
        isAvailable: true,
        currentTier: 'foundation',
        currentPrice: 29
      });
      return;
    }

    try {
      const response = await fetch('/api/foundation-stats');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch foundation stats:', error);
      // Production fallback
      setStats({
        foundationMembers: 0,
        spotsLeft: 100,
        totalSpots: 100,
        isAvailable: true,
        currentTier: 'foundation',
        currentPrice: 29
      });
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center antialiased">
        <div className="text-sm text-gray-400 font-light tracking-wide">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center antialiased">
      <div className="max-w-sm mx-auto px-8 py-12">
        {/* Logo/Title - Perfect Typography */}
        <h1 className="text-2xl font-light mb-12 tracking-tight leading-none">
          Signal/Noise
        </h1>

        {/* Main Value Proposition - Mathematical Beauty */}
        <div className="mb-12">
          <div className="text-7xl font-thin mb-3 text-white leading-none tracking-tighter">
            80/20
          </div>
          <div className="text-sm text-gray-400 font-light tracking-wide">
            Focus on what matters
          </div>
        </div>

        {/* Feature List - Minimal & Precise */}
        <div className="space-y-4 mb-12 text-sm font-light leading-relaxed">
          <div className="text-gray-300">AI Coach included</div>
          <div className="text-gray-300">Lifetime updates</div>
          <div className="text-gray-300">No subscription</div>
        </div>

        {/* Pricing - Clean Hierarchy */}
        <div className="mb-12">
          <div className="text-3xl font-light text-white mb-1 tracking-tight">
            €{stats.currentPrice}
          </div>
          <div className="text-xs text-gray-500 font-light tracking-wide uppercase">
            {stats.isAvailable ? 'Foundation Access' : 'Early Adopter'}
          </div>
        </div>

        {/* Simple Form - Perfect Spacing */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-4 text-sm font-light
                       focus:border-gray-600 focus:outline-none transition-all duration-300
                       placeholder-gray-600 tracking-wide rounded-none"
            required
          />

          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-transparent border border-gray-800 px-4 py-4 text-sm font-light
                       focus:border-gray-600 focus:outline-none transition-all duration-300
                       placeholder-gray-600 tracking-wide rounded-none"
          />

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full border border-gray-800 py-4 text-sm font-light tracking-wide
                       hover:bg-gray-900 hover:border-gray-700 disabled:opacity-40
                       disabled:cursor-not-allowed transition-all duration-300 rounded-none
                       active:bg-gray-800"
          >
            {loading ? 'Processing...' : 'Continue with purchase'}
          </button>
        </form>

        {/* Foundation Counter - Ultra Subtle */}
        <div className="text-xs text-gray-600 font-light tracking-wide">
          {stats.isAvailable ? (
            <div className="space-y-3">
              <div>
                {stats.foundationMembers} of {stats.totalSpots} Foundation members
              </div>
              <div className="h-px bg-gray-900 overflow-hidden">
                <div
                  className="h-px bg-gray-700 transition-all duration-2000 ease-out"
                  style={{
                    width: `${(stats.foundationMembers / stats.totalSpots) * 100}%`,
                    transform: 'translateZ(0)' // Hardware acceleration
                  }}
                />
              </div>
            </div>
          ) : (
            <div>Foundation tier complete - {stats.foundationMembers} members joined</div>
          )}
        </div>

        {/* Minimal timeline info - Barely There */}
        {stats.isAvailable && (
          <div className="mt-8 text-xs text-gray-700 font-light tracking-wide">
            Foundation pricing available through January
          </div>
        )}
      </div>
    </div>
  );
}