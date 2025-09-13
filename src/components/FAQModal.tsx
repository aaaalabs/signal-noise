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
      answer: "The 80/20 rule suggests that 80% of results come from 20% of efforts. In Signal/Noise, you classify tasks as 'Signal' (important, 80% time) or 'Noise' (distractions, 20% time) to achieve optimal focus."
    },
    {
      question: "How do I access premium features?",
      answer: "Click 'Dein Coach' to access premium AI coaching. The system intelligently detects if you're a new or returning member and shows the appropriate flow."
    },
    {
      question: "How do I delete tasks?",
      answer: "Long-press any task for a moment to reveal the delete option, then tap again to start a 3-second countdown. You can tap once more during the countdown to cancel deletion. The visual progress bar fills from right to left, giving you full control without accidental deletions."
    },
    {
      question: "What keyboard shortcuts are available?",
      answer: "Press Cmd+E (Mac) or Ctrl+E (Windows) to export your data. Use Tab to quickly switch between Signal and Noise when adding tasks - no need to click the buttons!"
    },
    {
      question: "How does the achievement system work?",
      answer: "You earn badges for consistency: Early Bird (morning tasks), Comeback (returning after breaks), Perfect Day (optimal ratios), Week Warrior, and Month Hero. Look for subtle glows when you unlock them!"
    },
    {
      question: "What do the small dots next to my ratio mean?",
      answer: "The small dots represent your achievement progress. Gray dots are locked milestones, darker dots are earned achievements, and green dots show your most recent unlock. Click them to see your progress (X/8 milestones). They appear only after you've earned your first achievement - a subtle reward system that grows with your consistency."
    },
    {
      question: "What are the sync indicators?",
      answer: "Premium users see a small sync indicator (🔒) next to the language switcher when data is protected and synced. It appears subtly during sync operations."
    },
    {
      question: "Can I switch languages instantly?",
      answer: "Yes! Click the barely visible 'EN'/'DE' toggle in the top-right corner. The entire interface switches immediately without page reload."
    },
    {
      question: "What happens to my data?",
      answer: "Everything is stored locally in your browser. Premium users get cloud backup, but your privacy is always protected. No tracking, no analytics, no data mining."
    },
    {
      question: "Foundation vs Early Adopter pricing?",
      answer: "Foundation Members (first 100 users): €29 lifetime access. After that: €49 Early Adopter pricing. Both include AI Coach, lifetime updates, and no subscription. The Foundation tier is designed for power users who discover quality tools early - a limited opportunity that won't return."
    },
    {
      question: "When does the AI Coach become available?",
      answer: "The AI Coach appears automatically once you have enough activity data for meaningful insights: 3+ day streak, or 7+ days with tasks, or 20+ total tasks. This ensures the AI has patterns to analyze and can provide valuable coaching rather than generic advice."
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
                  {faq.answer}
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