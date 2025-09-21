import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function ElonMuskArticle({ isGerman }: ArticleProps) {
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
          ? 'Das Elon Musk 100% Signal Experiment'
          : 'The Elon Musk 100% Signal Experiment'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        7 September 2025
      </div>

      {/* Elon Musk Photo from Wikipedia via Firecrawl */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '200px'
      }}>
        <img
          src="/elon-musk-2022.jpg"
          alt="Elon Musk in 2022"
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
          Elon Musk, 2022
        </p>
      </div>

      {/* Opening */}
      <p style={{
        fontSize: '1.2rem',
        lineHeight: '1.7',
        color: '#fff',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Kevin O'Leary behauptet, Elon Musk arbeitet mit 100% Signal. Keine Ablenkungen. Kein Noise. Ist das überhaupt möglich?</>
        ) : (
          <>Kevin O'Leary claims Elon Musk operates at 100% Signal. No distractions. No noise. Is that even possible?</>
        )}
      </p>

      {/* The Quote */}
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
          '"Elon ist bei 100%. Er hat keinen Noise in seinem Leben. Er arbeitet 80 bis 100 Stunden pro Woche, und jede einzelne Stunde ist Signal."'
        ) : (
          '"Elon is at 100%. He has no noise in his life. He works 80 to 100 hours a week, and every single hour is signal."'
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

      {/* The Schedule */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Wahrheit über Timeboxing' : 'The Truth About Timeboxing'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Entgegen populären Mythen hat Musk selbst klargestellt: "Ich mache definitiv nicht dieses 5-Minuten-Ding. Man braucht lange, ununterbrochene Zeit zum Nachdenken." Stattdessen nutzt er "Timeboxing" - größere Zeitblöcke für spezifische Aufgaben. Bei 80-100 Stunden pro Woche ist jede Stunde geplant und hat einen Zweck.</>
        ) : (
          <>Contrary to popular myths, Musk himself clarified: "I definitely don't do this 5 minute thing. Need to have long uninterrupted times to think." Instead, he uses "timeboxing" - larger time blocks for specific tasks. At 80-100 hours per week, every hour is planned and has a purpose.</>
        )}
      </p>

      {/* Daily Schedule Breakdown */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid #333',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '300',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Ein typischer Musk-Tag' : 'A Typical Musk Day'}
        </h3>
        <div style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd'
        }}>
          <div><strong>7:00 AM</strong> - Emails (critical only)</div>
          <div><strong>7:30 AM</strong> - Engineering problems</div>
          <div><strong>9:00 AM</strong> - Design review</div>
          <div><strong>10:00 AM</strong> - Production floor</div>
          <div><strong>12:00 PM</strong> - Lunch (5 minutes)</div>
          <div><strong>12:05 PM</strong> - Meetings (back-to-back)</div>
          <div><strong>7:00 PM</strong> - More engineering</div>
          <div><strong>10:00 PM</strong> - Strategic planning</div>
          <div><strong>1:00 AM</strong> - Sleep (sometimes)</div>
        </div>
      </div>

      {/* The Key Principles */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Prinzipien' : 'The Principles'}
      </h2>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* First Principles */}
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
            {isGerman ? '1. First Principles Thinking' : '1. First Principles Thinking'}
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Hinterfrage alles. Akzeptiere keine Annahmen. Baue von Grund auf neu.'
              : 'Question everything. Accept no assumptions. Build from the ground up.'}
          </p>
        </div>

        {/* No Meetings */}
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
            {isGerman ? '2. Meetings sind Gift' : '2. Meetings Are Poison'}
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Verlasse jedes Meeting, das keinen Wert bringt. Sofort. Ohne Entschuldigung.'
              : 'Walk out of any meeting that isn\'t adding value. Immediately. No apologies.'}
          </p>
        </div>

        {/* Feedback Loops */}
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
            {isGerman ? '3. Ultraschnelle Feedback-Loops' : '3. Ultra-Fast Feedback Loops'}
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Idee → Prototyp → Test → Iteration. In Stunden, nicht Wochen.'
              : 'Idea → Prototype → Test → Iterate. In hours, not weeks.'}
          </p>
        </div>
      </div>

      {/* Interview Video - Lex Fridman */}
      <div style={{
        float: 'left',
        marginRight: '1.5rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <a
          href="https://www.youtube.com/watch?v=DxREm3s1scA"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            position: 'relative'
          }}
        >
          <img
            src="/elon-lex-clean.jpg"
            alt="Elon Musk with Lex Fridman"
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid #333',
              display: 'block'
            }}
          />
          {/* Play button overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
          >
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '16px solid #fff',
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              marginLeft: '3px'
            }} />
          </div>
        </a>
        <p style={{
          fontSize: '0.75rem',
          color: '#666',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          Lex Fridman Podcast
        </p>
      </div>

      {/* Visual Break - Factory Floor Story */}
      <div style={{
        margin: '3rem 0',
        clear: 'both',
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid #333',
        borderLeft: '4px solid #00ff88'
      }}>
        <div style={{
          fontSize: '3rem',
          color: '#00ff88',
          marginBottom: '1rem',
          opacity: 0.3
        }}>
        </div>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Die Fabrikboden-Geschichte' : 'The Factory Floor Story'}
        </h3>
        <p style={{
          fontSize: '0.95rem',
          lineHeight: '1.7',
          color: '#ddd',
          marginBottom: '1rem'
        }}>
          {isGerman ? (
            <>2018: Musk lebte buchstäblich in der Tesla-Fabrik. Er hatte einen Schlafsack in einem Konferenzraum neben der Produktionslinie. YouTuber sammelten $9,000 für eine Couch, aber er schlief weiter unter seinem Schreibtisch.</>
          ) : (
            <>2018: Musk literally lived in the Tesla factory. He kept a sleeping bag in a conference room adjacent to the production line. YouTubers crowdfunded $9,000 for a couch, but he continued sleeping under his desk.</>
          )}
        </p>
        <blockquote style={{
          borderLeft: 'none',
          paddingLeft: 0,
          margin: '1rem 0 0 0',
          fontStyle: 'italic',
          color: '#00ff88',
          fontSize: '1.1rem',
          lineHeight: '1.7'
        }}>
          {isGerman ? (
            '"Ich wollte, dass meine Umstände schlimmer sind als die von jedem anderen in der Firma."'
          ) : (
            '"I wanted my circumstances to be worse than anyone else at the company."'
          )}
        </blockquote>
      </div>

      {/* The Cost */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Der Preis' : 'The Cost'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>100% Signal hat einen Preis. Musk hat es selbst zugegeben: "Ich arbeite verrückte Stunden. Das ist nicht normal und ich würde es niemandem empfehlen." Er schläft 6 Stunden pro Nacht. Er sieht seine Kinder nach einem strikten Zeitplan. Er hat mehrere Beziehungen scheitern lassen.</>
        ) : (
          <>100% Signal comes at a cost. Musk has admitted it himself: "I work crazy hours. This is not normal and I wouldn't recommend it to anyone." He sleeps 6 hours a night. He sees his kids on a strict schedule. He's had multiple relationships fail.</>
        )}
      </p>

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
          '"Niemand hat jemals die Welt verändert mit 40 Stunden pro Woche."'
        ) : (
          '"Nobody ever changed the world on 40 hours a week."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Elon Musk
        </cite>
      </blockquote>


      {/* TED Interview Video */}
      <div style={{
        float: 'right',
        marginLeft: '1.5rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <a
          href="https://www.youtube.com/watch?v=cdZZpaB2kDM&t=1620s"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            position: 'relative'
          }}
        >
          <img
            src="/elon-ted-2022.jpg"
            alt="Elon Musk at TED 2022"
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid #333',
              display: 'block'
            }}
          />
          {/* Play button overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
          >
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '16px solid #fff',
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              marginLeft: '3px'
            }} />
          </div>
        </a>
        <p style={{
          fontSize: '0.75rem',
          color: '#666',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          TED 2022 Interview
        </p>
      </div>

      {/* The Results */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem',
        clear: 'both'
      }}>
        {isGerman ? 'Die Ergebnisse' : 'The Results'}
      </h2>

      <div style={{
        display: 'grid',
        gap: '1rem',
        marginBottom: '2rem',
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd'
      }}>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <strong>Tesla:</strong> {isGerman ? 'Wertvollster Autohersteller der Welt' : 'Most valuable car manufacturer in the world'}
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <strong>SpaceX:</strong> {isGerman ? 'Erste wiederverwendbare Raketen' : 'First reusable rockets'}
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <strong>Neuralink:</strong> {isGerman ? 'Gehirn-Computer-Schnittstelle' : 'Brain-computer interface'}
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <strong>The Boring Company:</strong> {isGerman ? 'Tunnel-Innovation' : 'Tunnel innovation'}
        </div>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Vier Unternehmen gleichzeitig zu führen ist unmöglich - es sei denn, du arbeitest mit 100% Signal.</>
        ) : (
          <>Running four companies simultaneously is impossible - unless you operate at 100% Signal.</>
        )}
      </p>

      {/* Can You Do It? */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Kannst du es schaffen?' : 'Can You Do It?'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die Wahrheit? Die meisten Menschen können nicht bei 100% Signal arbeiten. Und das ist okay. Steve Jobs arbeitete bei 80% und baute Apple. Jeff Bezos arbeitet nur vormittags intensiv und baute Amazon. Warren Buffett verbringt 80% seiner Zeit mit Lesen und Nachdenken.</>
        ) : (
          <>The truth? Most people can't operate at 100% Signal. And that's okay. Steve Jobs operated at 80% and built Apple. Jeff Bezos only works intensely in the mornings and built Amazon. Warren Buffett spends 80% of his time reading and thinking.</>
        )}
      </p>

      {/* The Experiment */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Das Experiment' : 'The Experiment'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Ich habe versucht, eine Woche lang bei 100% Signal zu arbeiten. Hier ist was passierte:</>
        ) : (
          <>I tried working at 100% Signal for one week. Here's what happened:</>
        )}
      </p>

      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid #333',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd'
        }}>
          <div><strong>{isGerman ? 'Tag 1' : 'Day 1'}:</strong> {isGerman ? 'Energiegeladen. 14 Stunden pure Produktivität.' : 'Energized. 14 hours of pure productivity.'}</div>
          <div><strong>{isGerman ? 'Tag 2' : 'Day 2'}:</strong> {isGerman ? 'Fokussiert. Keine Social Media. Keine nutzlosen Meetings.' : 'Focused. No social media. No useless meetings.'}</div>
          <div><strong>{isGerman ? 'Tag 3' : 'Day 3'}:</strong> {isGerman ? 'Erschöpft. Kaffee hilft nicht mehr.' : 'Exhausted. Coffee isn\'t helping.'}</div>
          <div><strong>{isGerman ? 'Tag 4' : 'Day 4'}:</strong> {isGerman ? 'Reizbar. Familie beschwert sich.' : 'Irritable. Family complaining.'}</div>
          <div><strong>{isGerman ? 'Tag 5' : 'Day 5'}:</strong> {isGerman ? 'Produktiv aber unglücklich.' : 'Productive but unhappy.'}</div>
          <div><strong>{isGerman ? 'Tag 6' : 'Day 6'}:</strong> {isGerman ? 'Burnout-Symptome.' : 'Burnout symptoms.'}</div>
          <div><strong>{isGerman ? 'Tag 7' : 'Day 7'}:</strong> {isGerman ? 'Aufgegeben.' : 'Gave up.'}</div>
        </div>
      </div>

      {/* The Lesson */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Lektion' : 'The Lesson'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>100% Signal ist nicht für jeden. Aber wir können alle von Musks Prinzipien lernen: Eliminiere nutzlose Meetings. Timeboxe deine Aufgaben. Hinterfrage alles. Fokussiere dich auf das, was wirklich zählt.</>
        ) : (
          <>100% Signal isn't for everyone. But we can all learn from Musk's principles: Eliminate useless meetings. Timebox your tasks. Question everything. Focus on what truly matters.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die meisten von uns können ihre Produktivität verdoppeln, indem sie von 25% auf 50% Signal gehen. Du musst nicht Elon Musk sein, um erfolgreicher zu werden. Du musst nur mehr Signal und weniger Noise haben als gestern.</>
        ) : (
          <>Most of us can double our productivity by going from 25% to 50% Signal. You don't need to be Elon Musk to be more successful. You just need more Signal and less Noise than yesterday.</>
        )}
      </p>

      {/* Call to Action */}
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
          {isGerman ? 'Finde dein optimales Signal/Noise Verhältnis' : 'Find Your Optimal Signal/Noise Ratio'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Du musst nicht bei 100% sein. Finde heraus, was für dich funktioniert. Die Signal/Noise App hilft dir, deine perfekte Balance zu finden.</>
          ) : (
            <>You don't need to be at 100%. Find what works for you. The Signal/Noise app helps you discover your perfect balance.</>
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
          ? '"Wenn dir etwas wichtig genug ist, solltest du es versuchen. Selbst wenn das wahrscheinliche Ergebnis Misserfolg ist." - Elon Musk'
          : '"If something is important enough, you should try. Even if the probable outcome is failure." - Elon Musk'}
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
            <>100% Signal ist ein Ideal, keine Anforderung. Finde deine Balance.</>
          ) : (
            <>100% Signal is an ideal, not a requirement. Find your balance.</>
          )}
        </p>
      </div>
    </>
  );
}