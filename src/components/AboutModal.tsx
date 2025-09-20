import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AboutModal({ show, onClose }: AboutModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  const { currentLanguage } = useLanguage();
  const isGerman = currentLanguage === 'de';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#111827',
          border: '1px solid #374151',
          maxWidth: '48rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '1.5rem',
            marginTop: '0'
          }}>
            {isGerman ? 'Über Signal/Noise' : 'About Signal/Noise'}
          </h2>

          {/* Main description */}
          <div style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            {isGerman ? (
              <>
                <p style={{ marginBottom: '1rem' }}>
                  Signal/Noise ist eine minimalistische Produktivitäts-App, die auf einem einfachen Prinzip basiert:
                  <strong style={{ color: '#00ff88' }}> 80% deiner Zeit sollte für wichtige Aufgaben (Signal) verwendet werden,
                  nur 20% für Ablenkungen (Noise).</strong>
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Die App läuft zu 100% in deinem Browser - keine Anmeldung, keine Cloud, keine Datenweitergabe.
                  Deine Produktivitätsdaten bleiben komplett privat auf deinem Gerät. Mit Premium werden Daten zusätzlich
                  verschlüsselt synchronisiert, damit du sie auf mehreren Geräten nutzen kannst.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Inspiriert von Steve Jobs' Produktivitätsmethode: Er definierte "Signal" als die 3-5 kritischsten Aufgaben,
                  die in den nächsten 18 Stunden erledigt werden müssen. Alles andere ist "Noise" - Ablenkung vom Wesentlichen.
                </p>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '1rem' }}>
                  Signal/Noise is a minimalist productivity app based on a simple principle:
                  <strong style={{ color: '#00ff88' }}> 80% of your time should be spent on important tasks (Signal),
                  only 20% on distractions (Noise).</strong>
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  The app runs 100% in your browser - no registration, no cloud, no data sharing.
                  Your productivity data stays completely private on your device. With Premium, data is additionally
                  encrypted and synced so you can use it across multiple devices.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Inspired by Steve Jobs' productivity method: He defined "Signal" as the 3-5 most critical tasks
                  that need to be completed in the next 18 hours. Everything else is "Noise" - distraction from what matters.
                </p>
              </>
            )}
          </div>

          {/* YouTube Video */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '300',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Das Video, das diese App inspirierte' : 'The Video That Inspired This App'}
            </h3>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              border: '1px solid #374151'
            }}>
              <iframe
                src="https://www.youtube.com/embed/bzVuNxEVScs"
                title="Signal vs Noise - Productivity Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
              fontStyle: 'italic'
            }}>
              {isGerman ? (
                'Dieses Video-Tagebuch von Steven Bartlett befasst sich mit dem Konzept des "Signals versus Rauschens", inspiriert von Steve Jobs, um wichtige Aufgaben von Ablenkungen zu unterscheiden.'
              ) : (
                'This video diary of Steven Bartlett explores the concept of "Signal versus Noise", inspired by Steve Jobs, to distinguish important tasks from distractions.'
              )}
            </p>
          </div>

          {/* Sources & Inspiration */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '300',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Quellen & Inspiration' : 'Sources & Inspiration'}
            </h3>

            {/* Kevin O'Leary Video */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                color: '#00ff88',
                fontSize: '1rem',
                fontWeight: '300',
                marginBottom: '0.5rem'
              }}>
                Kevin O'Leary: Steve Jobs' Signal-to-Noise Method
              </h4>
              <a
                href="https://www.youtube.com/watch?v=mpAZehPviLQ&t=538s"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#9ca3af',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                The Diary Of A CEO - Kevin O'Leary Interview (8:58 - 13:40)
              </a>
              <p style={{
                color: '#d1d5db',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                {isGerman ? (
                  'Kevin O\'Leary erklärt Steve Jobs\' revolutionäre Produktivitätsmethode: 80% Signal (3-5 kritische Aufgaben in den nächsten 18 Stunden), 20% Noise (alles andere). Elon Musk erreicht sogar 100% Signal.'
                ) : (
                  'Kevin O\'Leary explains Steve Jobs\' revolutionary productivity method: 80% Signal (3-5 critical tasks in the next 18 hours), 20% Noise (everything else). Elon Musk achieves even 100% Signal.'
                )}
              </p>

              {/* Key Quote */}
              <blockquote style={{
                borderLeft: '3px solid #00ff88',
                paddingLeft: '1rem',
                margin: '1rem 0',
                fontStyle: 'italic',
                color: '#d1d5db',
                fontSize: '0.85rem',
                lineHeight: '1.6'
              }}>
                {isGerman ? (
                  '"Jobs\' Vision von Signal waren die 3-5 wichtigsten Dinge, die in den nächsten 18 Stunden erledigt werden müssen. Alles, was dich davon abhält, ist Noise. Sein Signal-zu-Noise-Verhältnis war 80:20."'
                ) : (
                  '"Jobs\' vision of Signal was the top 3 to 5 things you have to get done in the next 18 hours. Anything that stops you from doing that is the noise. His signal to noise ratio was 80:20."'
                )}
              </blockquote>
            </div>

            {/* Mentioned Visionaries */}
            <div style={{
              backgroundColor: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{
                color: '#00ff88',
                fontSize: '0.9rem',
                fontWeight: '300',
                marginBottom: '0.5rem'
              }}>
                {isGerman ? 'Pioniere der Methode' : 'Method Pioneers'}
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.5rem',
                color: '#d1d5db',
                fontSize: '0.85rem'
              }}>
                <div><strong>Steve Jobs</strong><br />Apple CEO, 80% Signal</div>
                <div><strong>Elon Musk</strong><br />100% Signal, 24/7</div>
                <div><strong>Jeff Bezos</strong><br />Morning-only decisions</div>
                <div><strong>Kevin O'Leary</strong><br />Shark Tank investor</div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '300',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Kern-Features' : 'Core Features'}
            </h3>
            <ul style={{
              color: '#d1d5db',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              paddingLeft: '1.5rem'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                {isGerman ? 'Binäre Entscheidung: Jede Aufgabe ist entweder Signal oder Noise' : 'Binary Decision: Each task is either Signal or Noise'}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                {isGerman ? 'Live Ratio-Anzeige: Sofortige Produktivitätsmessung' : 'Live Ratio Display: Instant productivity measurement'}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                {isGerman ? '100% Privat: Alle Daten bleiben in deinem Browser' : '100% Private: All data stays in your browser'}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                {isGerman ? 'Offline-fähig: Funktioniert ohne Internetverbindung' : 'Offline Capable: Works without internet connection'}
              </li>
            </ul>
          </div>

          {/* Philosophy */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '300',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Design-Philosophie' : 'Design Philosophy'}
            </h3>
            <blockquote style={{
              borderLeft: '3px solid #00ff88',
              paddingLeft: '1rem',
              margin: 0,
              fontStyle: 'italic',
              color: '#d1d5db',
              fontSize: '0.9rem'
            }}>
              {isGerman ?
                '"Das beste Interface ist kein Interface. Die beste KI ist unsichtbar."' :
                '"The best interface is no interface. The best AI is invisible."'
              }
            </blockquote>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.9rem',
              marginTop: '1rem',
              lineHeight: '1.6'
            }}>
              {isGerman ? (
                'Signal/Noise folgt den Prinzipien minimalistischen Designs: Reduktion, Klarheit, Respekt für deine Zeit und Privatsphäre.'
              ) : (
                'Signal/Noise follows the principles of minimalist design: Reduction, clarity, respect for your time and privacy.'
              )}
            </p>
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '300',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Technologie' : 'Technology'}
            </h3>
            <div style={{
              color: '#9ca3af',
              fontSize: '0.85rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              <div>React 18</div>
              <div>TypeScript</div>
              <div>LocalStorage</div>
              <div>Vercel KV</div>
              <div>PWA</div>
              <div>Vite</div>
              <div>CSS3</div>
              <div>TLS Encryption</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#9ca3af',
              fontSize: '0.8rem',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Entwickelt von' : 'Developed by'}{' '}
              <a
                href="https://libralab.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00ff88',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Libralab.ai
              </a>
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              fontStyle: 'italic'
            }}>
              {isGerman ?
                '"Fokussierung bedeutet Nein sagen." - Steve Jobs' :
                '"Focusing is about saying no." - Steve Jobs'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}