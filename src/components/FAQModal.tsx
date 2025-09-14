import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface FAQModalProps {
  show: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQModal({ show, onClose }: FAQModalProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const t = useTranslation();

  if (!show) return null;

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs: FAQItem[] = (t as any).faqItems || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 100,
            color: '#fff',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            {(t as any).faqTitle}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#999',
            fontWeight: 300,
            lineHeight: 1.5
          }}>
            {(t as any).faqSubtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ marginBottom: '32px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                marginBottom: '16px',
                border: '1px solid #222',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(index)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: openItems.includes(index) ? '#111' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!openItems.includes(index)) {
                    e.currentTarget.style.background = '#0a0a0a';
                  }
                }}
                onMouseOut={(e) => {
                  if (!openItems.includes(index)) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{faq.question}</span>
                <span style={{
                  fontSize: '12px',
                  color: '#666',
                  transform: openItems.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              </button>

              {/* Answer */}
              {openItems.includes(index) && (
                <div
                  style={{
                    padding: '20px',
                    background: '#0a0a0a',
                    borderTop: '1px solid #222',
                    fontSize: '13px',
                    color: '#ccc',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    animation: 'fadeInDown 0.3s ease'
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 32px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#999',
              fontSize: '14px',
              fontWeight: 300,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#666';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#999';
            }}
          >
            {(t as any).faqClose}
          </button>
        </div>

        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}