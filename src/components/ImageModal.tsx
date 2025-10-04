import { useEffect, useState } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
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
          alignItems: 'flex-start',
          zIndex: 1000,
          padding: '60px 20px 20px',
          cursor: 'pointer',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          style={{
            position: 'relative',
            width: isTall ? '70vw' : isVertical ? '80vw' : '95vw',
            maxWidth: '1200px',
            cursor: 'default',
            margin: '0 auto'
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

          {/* Image - Full size, scrollable */}
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '12px',
              border: '1px solid #333',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      </div>
    </>
  );
}