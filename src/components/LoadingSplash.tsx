import React, { useEffect, useState } from 'react';
import './LoadingSplash.css';

interface LoadingSplashProps {
  show: boolean;
  onComplete?: () => void;
}

const LoadingSplash: React.FC<LoadingSplashProps> = ({ show, onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);

      // Auto-complete after Blueprint Reveal duration (2200ms)
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="loading-splash">
      <div className="loading-splash-content">
        <div className={`loading-logo ${isAnimating ? 'loading-blueprint-reveal' : ''}`}>
          <div className="loading-icon">
            <img
              src="/sn-icon_outline_white.svg"
              alt="Signal/Noise Outline"
              className="loading-outline-icon"
            />
            <img
              src="/sn-icon_white.svg"
              alt="Signal/Noise"
              className="loading-solid-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;