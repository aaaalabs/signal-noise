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
    id: 'fade-in',
    name: 'Fade In',
    description: 'Simple opacity fade from 0 to 1',
    animationClass: 'splash-fade-in',
    duration: 1500
  },
  {
    id: 'scale-up',
    name: 'Scale Up',
    description: 'Logo scales from 0.5x to 1x with bounce',
    animationClass: 'splash-scale-up',
    duration: 2000
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    description: 'Logo slides up from bottom with ease-out',
    animationClass: 'splash-slide-up',
    duration: 1800
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Gentle pulse/heartbeat effect',
    animationClass: 'splash-pulse',
    duration: 2500
  },
  {
    id: 'rotate-fade',
    name: 'Rotate + Fade',
    description: 'Combination rotation and fade effect',
    animationClass: 'splash-rotate-fade',
    duration: 2200
  },
  {
    id: 'glow',
    name: 'Signal Glow',
    description: 'Signature green glow effect with fade',
    animationClass: 'splash-glow',
    duration: 2000
  }
];

const SplashScreenTester: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<SplashVariant>(splashVariants[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);

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

  return (
    <div className="splash-tester">
      {/* Controls Panel */}
      <div className="splash-controls">
        <h1 className="splash-title">Signal/Noise Splash Screen Variants</h1>

        <div className="splash-options">
          <div className="background-toggle">
            <label>
              <input
                type="checkbox"
                checked={isDarkBackground}
                onChange={(e) => setIsDarkBackground(e.target.checked)}
              />
              Dark Background
            </label>
          </div>

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
        className={`splash-preview ${isDarkBackground ? 'dark' : 'light'}`}
        style={{
          position: 'relative',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--surface)',
          borderRadius: '12px',
          margin: '20px 0'
        }}
      >
        {isPlaying && (
          <div className={`splash-logo ${selectedVariant.animationClass}`}>
            <div className="signal-logo">
              <span className="signal-text">Signal</span>
              <span className="noise-text">/Noise</span>
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