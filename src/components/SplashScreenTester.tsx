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
    id: 'honest-fade',
    name: 'Honest Fade',
    description: 'Pure minimalism - fade without effects',
    animationClass: 'splash-honest-fade',
    duration: 1000
  },
  {
    id: 'fade-glow-subtle',
    name: 'Fade + Subtle Glow',
    description: 'Jony Ive choice - honest glow, gentle presence',
    animationClass: 'splash-fade-glow-subtle',
    duration: 1800
  },
  {
    id: 'fade-glow-medium',
    name: 'Fade + Medium Glow',
    description: 'User preference - balanced visibility and restraint',
    animationClass: 'splash-fade-glow-medium',
    duration: 2000
  },
  {
    id: 'material-truth',
    name: 'Material Truth',
    description: 'Micro-scale materialization from digital ether',
    animationClass: 'splash-material-truth',
    duration: 1400
  },
  {
    id: 'breath-signal',
    name: 'Breath of Signal',
    description: 'Ultra-subtle breathing - barely perceptible life',
    animationClass: 'splash-breath-signal',
    duration: 4000
  },
  {
    id: 'signal-emergence',
    name: 'Signal Emergence',
    description: 'Geometric revelation from center outward',
    animationClass: 'splash-signal-emergence',
    duration: 1400
  },
  {
    id: 'blueprint-reveal',
    name: 'Blueprint Reveal',
    description: 'White outline first, then solid white form appears',
    animationClass: 'splash-blueprint-reveal',
    duration: 2200
  },
  {
    id: 'design-process',
    name: 'Design Process',
    description: 'White outline evolves into final white product',
    animationClass: 'splash-design-process',
    duration: 2800
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

  // Always use white icon on black background for proper visibility
  const getIconSource = () => '/sn-icon_white.svg';

  return (
    <div className="splash-tester">
      {/* Controls Panel */}
      <div className="splash-controls">
        <h1 className="splash-title">Signal/Noise Android Splash Variants</h1>
        <p className="splash-subtitle">White icons on black background - Jony Ive-inspired designs</p>

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
              {(selectedVariant.id === 'blueprint-reveal' || selectedVariant.id === 'design-process') ? (
                <>
                  <img
                    src="/sn-icon_outline_white.svg"
                    alt="Signal/Noise Outline"
                    className="icon-svg outline-icon"
                  />
                  <img
                    src="/sn-icon_white.svg"
                    alt="Signal/Noise"
                    className="icon-svg solid-icon"
                  />
                </>
              ) : (
                <img
                  src={getIconSource()}
                  alt="Signal/Noise"
                  className="icon-svg"
                />
              )}
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
        <h3>Android Implementation Guide</h3>
        <ul>
          <li><strong>Honest Fade:</strong> Use Android 12+ Splash Screen API with simple alpha transition</li>
          <li><strong>Subtle/Medium Glow:</strong> Implement with Layer effects or custom Canvas drawing</li>
          <li><strong>Material Truth:</strong> Hardware-accelerated PropertyAnimation with scale interpolator</li>
          <li><strong>Breath of Signal:</strong> Ultra-subtle animations require precise timing control</li>
          <li><strong>Signal Emergence:</strong> Combine scale + blur using RenderScript or modern effects</li>
          <li><strong>Blueprint Reveal:</strong> Layer two ImageViews with coordinated alpha animations</li>
          <li><strong>Design Process:</strong> Advanced LayerDrawable with synchronized filter effects</li>
          <li><strong>Performance:</strong> All animations respect Jony Ive's 60fps standard</li>
        </ul>
      </div>
    </div>
  );
};

export default SplashScreenTester;