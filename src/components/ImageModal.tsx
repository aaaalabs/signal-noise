import { useEffect, useState } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt, caption }: ImageModalProps) {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Load image to get dimensions
  useEffect(() => {
    if (isOpen && imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate optimal sizing based on aspect ratio
  const isVertical = imageSize && imageSize.height > imageSize.width;
  const isTall = imageSize && imageSize.height > imageSize.width * 1.5;

  return (
    <>
      {/* Modal Backdrop - Jony Ive Principle: Honest interaction without deception */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)', /* Nearly opaque for focus */
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          cursor: 'pointer'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          style={{
            position: 'relative',
            maxWidth: isTall ? '60vw' : isVertical ? '75vw' : '95vw',
            maxHeight: '95vh',
            cursor: 'default',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '-50px',
              right: '0',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            aria-label="Close image modal"
          >
            ×
          </button>

          {/* Image */}
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              width: isTall ? '60vw' : isVertical ? '75vw' : 'auto',
              height: 'auto',
              maxWidth: '95vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '12px',
              border: '1px solid #333',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              cursor: 'zoom-in'
            }}
            title="Click to view full resolution"
          />

          {/* Caption */}
          {caption && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#ffffff',
              padding: '15px 20px',
              borderRadius: '0 0 12px 12px',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '300',
                margin: 0,
                fontStyle: 'italic',
                lineHeight: '1.4'
              }}>
                {caption}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}