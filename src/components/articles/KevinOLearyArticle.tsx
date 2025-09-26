import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ArticleProps {
  isGerman: boolean;
}

export default function KevinOLearyArticle({ isGerman }: ArticleProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
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
          ? 'Kevin O\'Leary hatte Recht über Produktivität'
          : 'Kevin O\'Leary Was Right About Productivity'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        29 September 2025
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
          <>In einem Shark Tank Studio war ich nur der Typ mit dem Mikrofon. Kevin O'Leary war der Typ, der gerade die brutalste Wahrheit über Produktivität verkündet hatte, die ich je gehört habe.</>
        ) : (
          <>In a Shark Tank studio, I was just the guy with the microphone. Kevin O'Leary was the guy who had just delivered the most brutal truth about productivity I'd ever heard.</>
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
          '"Steve Jobs war kein netter Typ. Er würde mir um 2:30 Uhr morgens E-Mails schicken und erwarten, dass ich ihm antworte. Aber er lehrte mich eine Erfolgsformel, die Elon Musk heute verwendet: 80% Signal, 20% Noise."'
        ) : (
          '"Steve Jobs was not a nice guy. He would email me at 2:30 in the morning and expect me to get back to him. But he taught me a success formula that Elon Musk uses today: 80% Signal, 20% Noise."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Kevin O'Leary, Shark Tank
        </cite>
      </blockquote>

      {/* Kevin O'Leary Video Clip */}
      <div style={{
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        {!isVideoPlaying ? (
          // Thumbnail with play button overlay
          <div
            style={{
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto',
              cursor: 'pointer',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #333'
            }}
            onClick={() => setIsVideoPlaying(true)}
          >
            <img
              src="/blog-images/article-5-kevin-oleary/clip_thumbnail.jpg"
              alt="Kevin O'Leary discusses productivity"
              style={{
                width: '100%',
                display: 'block',
                filter: 'brightness(0.85)'
              }}
            />
            {/* Play Button Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(0, 255, 136, 0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 1)';
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.9)';
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
            >
              {/* Play Icon (Triangle) */}
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '25px solid #000',
                borderTop: '15px solid transparent',
                borderBottom: '15px solid transparent',
                marginLeft: '5px'
              }} />
            </div>
            {/* Duration Badge */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              2:00
            </div>
          </div>
        ) : (
          // Video Player
          <video
            width="100%"
            controls
            autoPlay
            style={{
              maxWidth: '800px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}
          >
            <source src="/blog-images/article-5-kevin-oleary/KevinOleary_2m.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <p style={{
          fontSize: '0.85rem',
          color: '#666',
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          {isGerman
            ? 'Kevin O\'Leary erklärt Steve Jobs\' Signal vs Noise Methodik im Diary of a CEO Podcast'
            : 'Kevin O\'Leary explains Steve Jobs\' Signal vs Noise methodology on The Diary of a CEO podcast'}
        </p>
      </div>

      {/* Kevin O'Leary Photo */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '220px'
      }}>
        <img
          src="/kevin-oleary-doac.jpg"
          alt="Kevin O'Leary"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #333'
          }}
        />
        <p style={{
          fontSize: '0.75rem',
          color: '#666',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          Kevin O'Leary, Shark Tank Investor
        </p>
      </div>

      {/* The Authority */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Autorität' : 'The Authority'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Kevin O'Leary ist nicht irgendein Geschäftsexperte. Er ist "Mr. Wonderful" aus Shark Tank, Dragons' Den-Veteran und der Mann, der bei The Learning Company direkt mit Steve Jobs zusammenarbeitete. Wenn O'Leary über Produktivität spricht, hört die Geschäftswelt zu - weil er die Methoden der erfolgreichsten Visionäre unserer Zeit aus erster Hand miterlebt hat.</>
        ) : (
          <>Kevin O'Leary isn't just any business expert. He's "Mr. Wonderful" from Shark Tank, Dragons' Den veteran, and the man who worked directly with Steve Jobs at The Learning Company. When O'Leary talks productivity, the business world listens - because he's witnessed the methods of our era's most successful visionaries firsthand.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>1999 verkaufte O'Leary The Learning Company für 4,2 Milliarden Dollar an Mattel. Aber bevor er zu einem der bekanntesten Investoren der Welt wurde, war er derjenige, der die 2:30-Uhr-E-Mails von Jobs erhielt. Er sah, wie ein Mann Apple von der Insolvenz zum wertvollsten Unternehmen der Welt führte.</>
        ) : (
          <>In 1999, O'Leary sold The Learning Company to Mattel for $4.2 billion. But before he became one of the world's most recognizable investors, he was the one receiving those 2:30 AM emails from Jobs. He watched a man take Apple from near bankruptcy to the world's most valuable company.</>
        )}
      </p>

      {/* The Original DOAC Interview */}
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
          The Diary of a CEO with Steven Bartlett (8:58 - 13:40)
        </p>
      </div>

      {/* The Formula Revealed */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Formel enthüllt' : 'The Formula Revealed'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Jobs teilte seinen Tag rigoros auf: 80% seiner Zeit ging an "Signal" - die 3-5 kritischsten Aufgaben, die in den nächsten 18 Stunden erledigt werden mussten. Die restlichen 20% waren unvermeidlicher "Noise" - E-Mails, Meetings, administrative Aufgaben.</>
        ) : (
          <>Jobs divided his day rigorously: 80% of his time went to "Signal" - the 3-5 most critical tasks that needed completion in the next 18 hours. The remaining 20% was unavoidable "Noise" - emails, meetings, administrative tasks.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Aber hier ist das Brutale: Jobs definierte "Signal" nicht als die wichtigsten Dinge im Allgemeinen. Es waren die spezifischen Aufgaben, die Apple in den nächsten 18 Stunden näher an sein visionäres Ziel bringen würden. Alles andere, egal wie "wichtig" es schien, war Noise.</>
        ) : (
          <>But here's the brutal part: Jobs didn't define "Signal" as the most important things in general. They were the specific tasks that would move Apple closer to its visionary goal in the next 18 hours. Everything else, no matter how "important" it seemed, was Noise.</>
        )}
      </p>

      {/* The 80/20 Breakdown */}
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Signal */}
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
            80% Signal - Die Vision vorantreiben
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? '• Produktentscheidungen, die die Zukunft definieren\n• Strategische Partnerschaften und Deals\n• Revolutionäre Designentscheidungen\n• Kritische Talentakquisition\n• Breakthrough-Innovationen'
              : '• Product decisions that define the future\n• Strategic partnerships and deals\n• Revolutionary design choices\n• Critical talent acquisition\n• Breakthrough innovations'}
          </p>
        </div>

        {/* Noise */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#ccc',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            20% Noise - Unvermeidbare Realität
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? '• E-Mails und administrative Aufgaben\n• Routinemeetings und Updates\n• Personalprobleme und Mikromanagement\n• Finanzberichte und Compliance\n• Externe Anfragen und PR'
              : '• Emails and administrative tasks\n• Routine meetings and updates\n• Personnel issues and micromanagement\n• Financial reports and compliance\n• External requests and PR'}
          </p>
        </div>
      </div>

      {/* The Brutal Reality */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die brutale Realität' : 'The Brutal Reality'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>O'Leary beschreibt Jobs als "nicht nett" - und das war der Punkt. Jobs verstand, dass Höflichkeit oft ein Luxus ist, den sich visionäre Führungskräfte nicht leisten können. Die 2:30-Uhr-E-Mails waren nicht sadistisch; sie waren Signal. Wenn dir um 2:30 Uhr morgens eine Idee kommt, die Apple transformieren könnte, wartest du nicht bis 9 Uhr.</>
        ) : (
          <>O'Leary describes Jobs as "not a nice guy" - and that was the point. Jobs understood that politeness is often a luxury visionary leaders can't afford. Those 2:30 AM emails weren't sadistic; they were Signal. When you get an idea at 2:30 AM that could transform Apple, you don't wait until 9 AM.</>
        )}
      </p>

      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1rem',
        lineHeight: '1.7'
      }}>
        {isGerman
          ? '"Er würde sagen: \'Halt den Mund und tu, was ich sage.\' Und weißt du was? Es funktionierte. Apple ging von 90 Tagen vor der Insolvenz zu einem 3-Billionen-Dollar-Unternehmen."'
          : '"He would say, \'Shut up and do what I tell you.\' And you know what? It worked. Apple went from 90 days from bankruptcy to a $3 trillion company."'}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Kevin O'Leary on Jobs' Leadership Style
        </cite>
      </blockquote>

      {/* Modern Evolution: Musk */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die moderne Evolution: Musk' : 'The Modern Evolution: Musk'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>O'Leary sieht Jobs' Methode in einem modernen Visionär perfektioniert: Elon Musk. "Er hat kein Noise", erklärt O'Leary. "60 Sekunden jeder Minute, 60 Minuten jeder Stunde, die 18 Stunden, die er wach ist - es ist alles Signal."</>
        ) : (
          <>O'Leary sees Jobs' method perfected in one modern visionary: Elon Musk. "He has no noise," O'Leary explains. "Sixty seconds of every minute, 60 minutes of every hour, the 18 hours he's awake, it's all signal."</>
        )}
      </p>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Jobs vs Musk */}
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
            Jobs: 80% Signal → Apple's Renaissance
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Produktlinie von 300+ auf 4 Produkte reduziert. Fokus auf perfekte Ausführung weniger revolutionärer Ideen.'
              : 'Cut product line from 300+ to 4 products. Focused on perfect execution of fewer revolutionary ideas.'}
          </p>
        </div>

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
            Musk: 100% Signal → Multi-Company Vision
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Führt gleichzeitig Tesla, SpaceX, Neuralink, xAI. Jede Minute ist auf die Mars-Kolonisation und nachhaltige Energie ausgerichtet.'
              : 'Simultaneously running Tesla, SpaceX, Neuralink, xAI. Every minute aligned with Mars colonization and sustainable energy.'}
          </p>
        </div>
      </div>

      {/* Why O'Leary Was Right */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Warum O\'Leary Recht hatte' : 'Why O\'Leary Was Right'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Dreißig Jahre später validieren die Ergebnisse O'Learys Beobachtungen. Die Signal/Noise-Formel ist nicht nur eine Produktivitätsmethode - sie ist ein fundamentales Prinzip für visionäre Führung. Jeder Gründer, der ein weltveränderndes Unternehmen aufbauen will, muss verstehen: Zeit ist das einzige wirklich knappe Gut.</>
        ) : (
          <>Thirty years later, the results validate O'Leary's observations. The Signal/Noise formula isn't just a productivity method - it's a fundamental principle of visionary leadership. Every founder building a world-changing company must understand: time is the only truly scarce resource.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>O'Leary lehrt diese Methode heute an der Boston University und berät Fortune-500-CEOs. "Die meisten Führungskräfte", sagt er, "verbringen 80% ihrer Zeit mit Noise und denken, sie seien produktiv. Jobs und Musk haben das umgekehrt - und das machte den Unterschied."</>
        ) : (
          <>O'Leary teaches this method today at Boston University and advises Fortune 500 CEOs. "Most executives," he says, "spend 80% of their time on Noise and think they're being productive. Jobs and Musk flipped that - and that made all the difference."</>
        )}
      </p>

      {/* Your Signal/Noise Ratio */}
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
          {isGerman ? 'Berechne dein Signal/Noise-Verhältnis' : 'Calculate Your Signal/Noise Ratio'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Die Signal/Noise-App wendet O'Learys Beobachtungen auf dein tägliches Leben an. Keine komplexen Features, keine Ablenkungen - nur die brutale Wahrheit über deine Produktivität. Wie Jobs und Musk klassifizierst du jede Aufgabe: Signal oder Noise?</>
          ) : (
            <>The Signal/Noise app applies O'Leary's observations to your daily life. No complex features, no distractions - just the brutal truth about your productivity. Like Jobs and Musk, you classify every task: Signal or Noise?</>
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

      {/* The Uncomfortable Truth */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die unbequeme Wahrheit' : 'The Uncomfortable Truth'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Jobs war "kein netter Typ", weil nett sein oft bedeutet, anderen zu erlauben, deine Zeit zu verschwenden. O'Leary erkannte, dass wahre visionäre Führung bedeutet, unbequeme Entscheidungen über Prioritäten zu treffen - auch wenn es andere vor den Kopf stößt.</>
        ) : (
          <>Jobs was "not a nice guy" because being nice often means allowing others to waste your time. O'Leary recognized that true visionary leadership means making uncomfortable decisions about priorities - even when it upsets others.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die meisten von uns sind zu höflich mit unserer Zeit. Wir sagen Ja zu "wichtigen" Meetings, bearbeiten "dringende" E-Mails und erledigen "notwendige" Aufgaben. Aber wie O'Leary beobachtete: Wenn alles wichtig ist, ist nichts wichtig.</>
        ) : (
          <>Most of us are too polite with our time. We say yes to "important" meetings, answer "urgent" emails, and complete "necessary" tasks. But as O'Leary observed: when everything is important, nothing is important.</>
        )}
      </p>

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
          ? '"Steve lehrte mich, dass Erfolg nicht darum geht, mehr zu tun. Es geht darum, die richtigen Dinge mit absoluter Präzision zu tun. Das ist Signal."'
          : '"Steve taught me that success isn\'t about doing more. It\'s about doing the right things with absolute precision. That\'s Signal."'}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Kevin O'Leary's Final Lesson
        </cite>
      </blockquote>

      {/* Related Articles */}
      <div style={{
        borderTop: '1px solid #222',
        marginTop: '4rem',
        paddingTop: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '300',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Verwandte Artikel' : 'Related Articles'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/blog/steve-jobs-method" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            → {isGerman ? 'Steve Jobs\' Produktivitätsmethode' : 'Steve Jobs\' Productivity Method'}
          </Link>
          <Link to="/blog/elon-musk-100-signal" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            → {isGerman ? 'Das Elon Musk 100% Signal Experiment' : 'The Elon Musk 100% Signal Experiment'}
          </Link>
        </div>
      </div>

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
            <>Dieser Artikel ist Teil unserer Serie über Produktivitätsmethoden erfolgreicher Visionäre.</>
          ) : (
            <>This article is part of our series on productivity methods of successful visionaries.</>
          )}
        </p>
      </div>
    </>
  );
}