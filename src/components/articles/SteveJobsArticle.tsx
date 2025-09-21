import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function SteveJobsArticle({ isGerman }: ArticleProps) {
  return (
    <>
      {/* Title */}
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '100',
        color: '#fff',
        marginBottom: '0.5rem',
        lineHeight: '1.3'
      }}>
        {isGerman
          ? 'Steve Jobs\' Produktivitätsmethode'
          : 'Steve Jobs\' Productivity Method'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        21 September 2025
      </div>

      {/* Opening */}
      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Kevin O'Leary saß Steven Bartlett gegenüber und sagte etwas, das meine Sicht auf Produktivität für immer veränderte.</>
        ) : (
          <>Kevin O'Leary sat across from Steven Bartlett and said something that changed how I see productivity forever.</>
        )}
      </p>

      {/* Main Quote */}
      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1.1rem',
        lineHeight: '1.7'
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
          color: '#999'
        }}>
          — Kevin O'Leary, The Diary of a CEO
        </cite>
      </blockquote>

      {/* The Method */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Methode' : 'The Method'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Steve Jobs hatte eine einfache Regel: 80% seiner Zeit widmete er "Signal" - den 3-5 kritischsten Aufgaben, die in den nächsten 18 Stunden erledigt werden mussten. Die restlichen 20% waren "Noise" - unvermeidbare Ablenkungen des Alltags.</>
        ) : (
          <>Steve Jobs had a simple rule: 80% of his time went to "Signal" - the 3-5 most critical tasks that needed completion in the next 18 hours. The remaining 20% was "Noise" - the unavoidable distractions of daily life.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Diese Methode war nicht nur Theorie. Als Jobs 1997 zu Apple zurückkehrte, fand er ein Unternehmen vor, das 90 Tage vor der Insolvenz stand. Durch radikale Fokussierung - er strich die Produktlinie von über 300 auf nur 10 Produkte zusammen - rettete er nicht nur Apple, sondern machte es zum wertvollsten Unternehmen der Welt.</>
        ) : (
          <>This wasn't just theory. When Jobs returned to Apple in 1997, he found a company 90 days from bankruptcy. Through radical focus - cutting the product line from over 300 to just 10 products - he not only saved Apple but transformed it into the world's most valuable company.</>
        )}
      </p>

      {/* YouTube Video */}
      <div style={{ margin: '3rem 0' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? 'Das Original-Interview' : 'The Original Interview'}
        </h2>

        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/mpAZehPviLQ?start=538&end=820"
            title="Kevin O'Leary on Steve Jobs Signal vs Noise"
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
          color: '#666',
          fontSize: '0.85rem',
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          Kevin O'Leary, The Diary of a CEO (8:58 - 13:40)
        </p>
      </div>

      {/* Comparison with Others */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Visionäre und ihre Verhältnisse' : 'The Visionaries and Their Ratios'}
      </h2>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Steve Jobs */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h3 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            Steve Jobs - 80% Signal
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? '3-5 kritische Aufgaben pro 18 Stunden. Alles andere ist Ablenkung.'
              : '3-5 critical tasks per 18 hours. Everything else is distraction.'}
          </p>
        </div>

        {/* Elon Musk */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            Elon Musk - 100% Signal
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Keine Ablenkungen. 80-120 Stunden pro Woche. Jede Minute zählt.'
              : 'No distractions. 80-120 hours per week. Every minute counts.'}
          </p>
        </div>

        {/* Jeff Bezos */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            Jeff Bezos - Morning Signal
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Wichtige Entscheidungen nur vor 10 Uhr morgens.'
              : 'Important decisions only before 10 AM.'}
          </p>
        </div>
      </div>

      {/* Practical Application */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die praktische Anwendung' : 'Practical Application'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die Herausforderung für moderne Gründer ist nicht Zeitmangel - es ist Fokus. Wir haben mehr Tools, mehr Möglichkeiten und mehr Ablenkungen als je zuvor. Die Signal/Noise-Methode zwingt uns zu einer einfachen Frage: Bewegt diese Aufgabe mein Business vorwärts oder hält sie mich nur beschäftigt?</>
        ) : (
          <>The challenge for modern founders isn't lack of time - it's lack of focus. We have more tools, more opportunities, and more distractions than ever. The Signal/Noise method forces us to ask one simple question: Does this task move my business forward or just keep me busy?</>
        )}
      </p>

      {/* The App */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginTop: '3rem',
        marginBottom: '3rem'
      }}>
        <h3 style={{
          color: '#00ff88',
          fontSize: '1.2rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Signal/Noise: Die App' : 'Signal/Noise: The App'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Inspiriert von Jobs' Methode haben wir eine minimalistische App entwickelt, die dir hilft, Signal von Noise zu unterscheiden. Keine komplexen Features, keine Ablenkungen - nur die brutale Wahrheit über deine Produktivität.</>
          ) : (
            <>Inspired by Jobs' method, we built a minimalist app that helps you distinguish Signal from Noise. No complex features, no distractions - just the brutal truth about your productivity.</>
          )}
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{
            display: 'inline-block',
            backgroundColor: '#00ff88',
            color: '#000',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            {isGerman ? 'App ausprobieren' : 'Try the App'}
          </Link>
        </div>
      </div>

      {/* Closing Quote */}
      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '3rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1rem',
        lineHeight: '1.7'
      }}>
        {isGerman
          ? '"Fokussierung bedeutet Nein sagen." - Steve Jobs'
          : '"Focusing is about saying no." - Steve Jobs'}
      </blockquote>

      {/* Author Note */}
      <div style={{
        borderTop: '1px solid #222',
        marginTop: '3rem',
        paddingTop: '2rem',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#666',
          fontSize: '0.85rem',
          fontStyle: 'italic'
        }}>
          {isGerman ? (
            <>Dieser Artikel ist Teil unserer Serie über Produktivitätsmethoden erfolgreicher Gründer.</>
          ) : (
            <>This article is part of our series on productivity methods of successful founders.</>
          )}
        </p>
      </div>
    </>
  );
}