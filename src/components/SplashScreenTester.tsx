import React, { useState } from 'react';
import './SplashScreenTester.css';

interface SplashVariant {
  id: string;
  name: string;
  description: string;
  animationClass: string;
  duration: number;
}

const splashVariants: SplashVariant[] = [
  {
    id: 'simple-fade',
    name: 'Simple Fade',
    description: 'Clean fade-in, no glow',
    animationClass: 'splash-simple-fade',
    duration: 1200
  },
  {
    id: 'fade-glow-subtle',
    name: 'Fade + Subtle Glow',
    description: 'Fade-in with gentle green glow',
    animationClass: 'splash-fade-glow-subtle',
    duration: 1800
  },
  {
    id: 'fade-glow-medium',
    name: 'Fade + Medium Glow',
    description: 'Fade-in with moderate green glow',
    animationClass: 'splash-fade-glow-medium',
    duration: 2000
  },
  {
    id: 'fade-glow-strong',
    name: 'Fade + Strong Glow',
    description: 'Fade-in with pronounced green glow',
    animationClass: 'splash-fade-glow-strong',
    duration: 2200
  },
  {
    id: 'breathing-glow',
    name: 'Breathing Glow',
    description: 'Fade-in with gentle breathing glow effect',
    animationClass: 'splash-breathing-glow',
    duration: 3000
  },
  {
    id: 'signal-pulse',
    name: 'Signal Pulse',
    description: 'Fade-in with signature signal pulse',
    animationClass: 'splash-signal-pulse',
    duration: 2500
  }
];

const SplashScreenTester: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<SplashVariant>(splashVariants[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSplash = (variant: SplashVariant) => {
    setSelectedVariant(variant);
    setIsPlaying(true);

    // Auto-stop after animation completes
    setTimeout(() => {
      setIsPlaying(false);
    }, variant.duration);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
  };

  // Always use black icon on dark background with green glow for visibility
  const getIconSource = () => '/sn-icon.svg';

  return (
    <div className="splash-tester">
      {/* Controls Panel */}
      <div className="splash-controls">
        <h1 className="splash-title">Signal/Noise Android Splash Variants</h1>
        <p className="splash-subtitle">Black icon on dark background with green signal glow variations</p>

        <div className="splash-options">

          <div className="variant-grid">
            {splashVariants.map((variant) => (
              <button
                key={variant.id}
                className={`variant-button ${selectedVariant.id === variant.id ? 'active' : ''}`}
                onClick={() => playSplash(variant)}
                disabled={isPlaying}
              >
                <div className="variant-name">{variant.name}</div>
                <div className="variant-description">{variant.description}</div>
                <div className="variant-duration">{variant.duration}ms</div>
              </button>
            ))}
          </div>

          <div className="control-buttons">
            <button
              className="control-btn play"
              onClick={() => playSplash(selectedVariant)}
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing...' : 'Play Selected'}
            </button>
            <button
              className="control-btn reset"
              onClick={resetAnimation}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Splash Preview Area */}
      <div
        className="splash-preview dark"
        style={{
          position: 'relative',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--surface)',
          borderRadius: '12px',
          margin: '20px 0',
          background: '#000000'
        }}
      >
        {isPlaying && (
          <div className={`splash-logo ${selectedVariant.animationClass}`}>
            <div className="signal-icon">
              <img
                src={getIconSource()}
                alt="Signal/Noise"
                className="icon-svg"
              />
            </div>
          </div>
        )}

        {!isPlaying && (
          <div className="preview-placeholder">
            <div className="placeholder-text">
              Click a variant above to preview
            </div>
            <div className="selected-info">
              Selected: <strong>{selectedVariant.name}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Animation Info */}
      <div className="animation-info">
        <h3>Current Selection: {selectedVariant.name}</h3>
        <p>{selectedVariant.description}</p>
        <p><strong>Duration:</strong> {selectedVariant.duration}ms</p>
        <p><strong>CSS Class:</strong> .{selectedVariant.animationClass}</p>
      </div>

      {/* Android Implementation Notes */}
      <div className="implementation-notes">
        <h3>Android Implementation Notes</h3>
        <ul>
          <li><strong>Animated Vector Drawable:</strong> Convert logo to SVG, create AVD for native Android animations</li>
          <li><strong>Lottie:</strong> Export animations as JSON for complex effects (glow, pulse)</li>
          <li><strong>Splash Screen API:</strong> Android 12+ native splash with icon animation</li>
          <li><strong>Performance:</strong> Hardware acceleration recommended for smooth animations</li>
        </ul>
      </div>
    </div>
  );
};

export default SplashScreenTester;