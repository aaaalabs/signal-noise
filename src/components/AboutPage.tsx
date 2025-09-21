import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const { currentLanguage } = useLanguage();
  const isGerman = currentLanguage === 'de';

  useEffect(() => {
    // SEO meta tags
    document.title = isGerman
      ? 'Signal/Noise - 80/20 Produktivitätsmethode von Steve Jobs'
      : 'Signal/Noise - Steve Jobs 80/20 Productivity Method';

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', isGerman
        ? 'Die revolutionäre Produktivitätsmethode von Steve Jobs: 80% Signal (wichtige Aufgaben), 20% Noise. Wie Elon Musk und Jeff Bezos ihre Zeit optimieren.'
        : 'Steve Jobs revolutionary productivity method: 80% Signal (important tasks), 20% Noise. How Elon Musk and Jeff Bezos optimize their time.'
      );
    }

    // Structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Signal/Noise",
      "description": isGerman
        ? "Minimalistische Produktivitäts-App basierend auf Steve Jobs' 80/20 Methode"
        : "Minimalist productivity app based on Steve Jobs' 80/20 method",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      },
      "creator": {
        "@type": "Organization",
        "name": "Libralab.ai",
        "url": "https://libralab.ai"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isGerman]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '2rem'
    }}>
      {/* Navigation */}
      <nav style={{
        maxWidth: '48rem',
        margin: '0 auto 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: '#00ff88',
          textDecoration: 'none',
          fontSize: '1.2rem',
          fontWeight: '300'
        }}>
          ← {isGerman ? 'Zurück zur App' : 'Back to App'}
        </Link>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          signal-noise.app
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '48rem',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '100',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Signal/<span style={{ color: '#666' }}>Noise</span>
          </h1>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '1.5rem'
          }}>
            {isGerman
              ? 'Die Steve Jobs Produktivitätsmethode'
              : 'The Steve Jobs Productivity Method'}
          </p>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#d1d5db'
          }}>
            {isGerman ? (
              <>80% deiner Zeit für <strong style={{ color: '#00ff88' }}>Signal</strong> (wichtige Aufgaben),
              20% für <strong style={{ color: '#666' }}>Noise</strong> (Ablenkungen).
              So arbeiteten Steve Jobs, Elon Musk und Jeff Bezos.</>
            ) : (
              <>80% of your time on <strong style={{ color: '#00ff88' }}>Signal</strong> (important tasks),
              20% on <strong style={{ color: '#666' }}>Noise</strong> (distractions).
              This is how Steve Jobs, Elon Musk and Jeff Bezos work.</>
            )}
          </p>
        </header>

        {/* Video Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            {isGerman ? 'Die Ursprünge: Kevin O\'Leary über Steve Jobs' : 'The Origins: Kevin O\'Leary on Steve Jobs'}
          </h2>

          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            marginBottom: '1rem',
            backgroundColor: '#111',
            border: '1px solid #222'
          }}>
            <iframe
              src="https://www.youtube.com/embed/mpAZehPviLQ?start=538&end=820"
              title="Kevin O'Leary on Steve Jobs Signal vs Noise Method"
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

          <blockquote style={{
            borderLeft: '3px solid #00ff88',
            paddingLeft: '1.5rem',
            margin: '2rem 0',
            fontStyle: 'italic',
            color: '#d1d5db',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            {isGerman ? (
              '"Jobs\' Vision von Signal waren die 3-5 wichtigsten Dinge, die in den nächsten 18 Stunden erledigt werden müssen. Alles, was dich davon abhält, ist Noise. Sein Signal-zu-Noise-Verhältnis war 80:20."'
            ) : (
              '"Jobs\' vision of Signal was the top 3 to 5 things you have to get done in the next 18 hours. Anything that stops you from doing that is the noise. His signal to noise ratio was 80:20."'
            )}
            <cite style={{
              display: 'block',
              marginTop: '0.5rem',
              fontStyle: 'normal',
              fontSize: '0.9rem',
              color: '#9ca3af'
            }}>
              — Kevin O'Leary, Shark Tank
            </cite>
          </blockquote>
        </section>

        {/* Method Comparison */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            {isGerman ? 'Die Methode der Visionäre' : 'The Visionaries\' Method'}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#00ff88', fontSize: '1.2rem', fontWeight: '300', marginBottom: '0.5rem' }}>
                Steve Jobs
              </h3>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Apple CEO & Co-Founder
              </p>
              <div style={{ fontSize: '2rem', fontWeight: '100', color: '#00ff88' }}>
                80% Signal
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {isGerman ? '3-5 kritische Aufgaben pro 18 Stunden' : '3-5 critical tasks per 18 hours'}
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid #333',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '300', marginBottom: '0.5rem' }}>
                Elon Musk
              </h3>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Tesla, SpaceX, X
              </p>
              <div style={{ fontSize: '2rem', fontWeight: '100', color: '#00ff88' }}>
                100% Signal
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {isGerman ? 'Keine Ablenkungen, 24/7 Fokus' : 'No distractions, 24/7 focus'}
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid #333',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '300', marginBottom: '0.5rem' }}>
                Jeff Bezos
              </h3>
              <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Amazon Founder
              </p>
              <div style={{ fontSize: '2rem', fontWeight: '100', color: '#00ff88' }}>
                Morning Signal
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {isGerman ? 'Wichtige Entscheidungen nur vormittags' : 'Important decisions only in mornings'}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            {isGerman ? 'So funktioniert Signal/Noise' : 'How Signal/Noise Works'}
          </h2>

          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{
                color: '#00ff88',
                fontSize: '1.5rem',
                fontWeight: '100',
                minWidth: '2rem'
              }}>1</div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '300', marginBottom: '0.5rem' }}>
                  {isGerman ? 'Aufgabe eingeben' : 'Enter a task'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {isGerman
                    ? 'Schreibe auf, was du heute erledigen willst'
                    : 'Write down what you want to accomplish today'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{
                color: '#00ff88',
                fontSize: '1.5rem',
                fontWeight: '100',
                minWidth: '2rem'
              }}>2</div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '300', marginBottom: '0.5rem' }}>
                  {isGerman ? 'Signal oder Noise?' : 'Signal or Noise?'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {isGerman
                    ? 'Bewegt diese Aufgabe dein Business vorwärts? Dann ist es Signal.'
                    : 'Does this task move your business forward? Then it\'s Signal.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{
                color: '#00ff88',
                fontSize: '1.5rem',
                fontWeight: '100',
                minWidth: '2rem'
              }}>3</div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '300', marginBottom: '0.5rem' }}>
                  {isGerman ? 'Deine Ratio sehen' : 'See your ratio'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {isGerman
                    ? 'Sofort siehst du, ob du bei 80% Signal bist - oder dich in Noise verlierst.'
                    : 'Instantly see if you\'re at 80% Signal - or losing yourself in Noise.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Features */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            {isGerman ? '100% Privat, 0% Bullshit' : '100% Private, 0% Bullshit'}
          </h2>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gap: '1rem'
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                {isGerman ? 'Keine Anmeldung erforderlich' : 'No registration required'}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                {isGerman ? 'Alle Daten bleiben in deinem Browser' : 'All data stays in your browser'}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                {isGerman ? 'Funktioniert offline' : 'Works offline'}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                {isGerman ? 'Kostenlos für immer' : 'Free forever'}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                {isGerman ? 'Premium: AI Coach für personalisierte Insights' : 'Premium: AI Coach for personalized insights'}
              </span>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section style={{
          textAlign: 'center',
          padding: '3rem 0',
          borderTop: '1px solid #222'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '100',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            {isGerman ? 'Bereit für die Wahrheit?' : 'Ready for the truth?'}
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            marginBottom: '2rem'
          }}>
            {isGerman
              ? 'Finde heraus, wie viel deiner Zeit wirklich produktiv ist.'
              : 'Find out how much of your time is actually productive.'}
          </p>
          <Link to="/" style={{
            display: 'inline-block',
            backgroundColor: '#00ff88',
            color: '#000',
            padding: '1rem 2rem',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isGerman ? 'App starten' : 'Start App'}
          </Link>
        </section>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '2rem 0',
          borderTop: '1px solid #222',
          color: '#666',
          fontSize: '0.85rem'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            {isGerman ? 'Entwickelt von' : 'Developed by'}{' '}
            <a href="https://libralab.ai" target="_blank" rel="noopener noreferrer"
               style={{ color: '#00ff88', textDecoration: 'none' }}>
              Libralab.ai
            </a>
          </p>
          <p style={{ fontStyle: 'italic' }}>
            "Focusing is about saying no." - Steve Jobs
          </p>
        </footer>
      </main>
    </div>
  );
}