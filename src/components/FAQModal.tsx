import { useState } from 'react';

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

  if (!show) return null;

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs: FAQItem[] = [
    {
      question: "What is the 80/20 principle?",
      answer: "The 80/20 rule suggests that <span style='color: #00ff88'>80%</span> of results come from <span style='color: #666'>20%</span> of efforts. In Signal/Noise, you classify tasks as 'Signal' (important, <span style='color: #00ff88'>80%</span> time) or 'Noise' (distractions, <span style='color: #666'>20%</span> time) to achieve optimal focus."
    },
    {
      question: "How do I use Signal/Noise effectively?",
      answer: "Add tasks and classify them as Signal (important) or Noise (distractions). Use Tab to quickly switch between categories. <strong>Triple-tap any task</strong> to move it between Signal/Noise columns - you'll see progressive visual feedback and arrows showing the destination. <strong>Hold any task for 2.5 seconds</strong> to delete it with a progress bar. Press Cmd+E (Mac) or Ctrl+E (Windows) to export your data."
    },
    {
      question: "How do achievements and progress tracking work?",
      answer: "You earn badges for consistency: Early Bird (morning tasks), Comeback (returning after breaks), Perfect Day (optimal ratios), Week Warrior, and Month Hero. Small dots next to your ratio show achievement progress - gray (locked), dark (earned), green (recent unlock). Click them to see your X/8 milestone progress."
    },
    {
      question: "What are premium features and pricing?",
      answer: "Premium includes AI Coach, cloud sync, and lifetime updates. Foundation Members (first 100 users): €29 lifetime. After that: €49 Early Adopter pricing. No subscription - pay once, own forever. The AI Coach appears after 3+ day streak, 7+ days with tasks, or 20+ total tasks."
    },
    {
      question: "How does data privacy and sync work?",
      answer: "Everything is stored locally in your browser. Premium users get cloud backup with sync indicator (🔒) next to the language switcher. Your privacy is always protected - no tracking, no analytics, no data mining."
    },
    {
      question: "What interface features are available?",
      answer: "Click the barely visible 'EN'/'DE' toggle in the top-right corner to switch languages instantly. The entire interface changes without page reload. Premium users see subtle sync indicators during operations."
    }
  ];

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
            FAQ
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#999',
            fontWeight: 300,
            lineHeight: 1.5
          }}>
            Frequently asked questions & hidden features
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
            Close
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