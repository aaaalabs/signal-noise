import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function SignalVsNoisePhilosophyArticle({ isGerman }: ArticleProps) {
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
          ? 'Signal vs Noise: Eine Philosophie für das moderne Leben'
          : 'Signal vs Noise: A Philosophy for Modern Life'}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.1rem',
        color: '#999',
        marginBottom: '0.5rem',
        fontStyle: 'italic',
        fontWeight: '300'
      }}>
        {isGerman
          ? 'Wie die Informationstheorie zur Geheimwaffe der fokussiertesten Menschen wurde'
          : 'How information theory became the secret weapon of history\'s most focused achievers'}
      </p>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        13 October 2025
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
          <>Claude Shannon stellte sich nie vor, dass seine Informationstheorie von 1948 zu einer Produktivitätsmethode werden würde. Der Bell Labs-Ingenieur versuchte Probleme mit der Telefonkommunikation zu lösen, nicht menschlichen Fokus.</>
        ) : (
          <>Claude Shannon never imagined his 1948 information theory would become a productivity methodology. The Bell Labs engineer was trying to solve problems with telephone communications, not human focus.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Aber seine grundlegende Erkenntnis—dass Informationssysteme zwischen bedeutungsvollen Signalen und bedeutungslosem Rauschen unterscheiden müssen—hat revolutioniert, wie die erfolgreichsten Menschen der Welt ihre tägliche Arbeit angehen.</>
        ) : (
          <>But his fundamental insight—that information systems must distinguish between meaningful signals and meaningless noise—has quietly revolutionized how the world's most successful people approach their daily work.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Steve Jobs verinnerlichte diese Philosophie. Elon Musk verkörpert sie vollständig. Und jetzt entsteht Signal vs Noise Denken als Gegenmittel zu unserem Zeitalter der Informationsüberflutung.</>
        ) : (
          <>Steve Jobs internalized this philosophy. Elon Musk embodies it completely. And now, Signal vs Noise thinking is emerging as the antidote to our age of information overload.</>
        )}
      </p>

      {/* Section: What Is Signal vs Noise */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Was ist Signal vs Noise in der Produktivität?' : 'What Is Signal vs Noise in Productivity?'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>In Claude Shannons ursprünglichem Framework repräsentiert <strong style={{color: '#00ff88'}}>Signal</strong> die beabsichtigte Nachricht in jedem Kommunikationssystem, während <strong style={{color: '#ff6b6b'}}>Rauschen</strong> alle Interferenzen umfasst, die diese Nachricht verfälschen oder davon ablenken.</>
        ) : (
          <>In Claude Shannon's original framework, <strong style={{color: '#00ff88'}}>signal</strong> represents the intended message in any communication system, while <strong style={{color: '#ff6b6b'}}>noise</strong> encompasses all the interference that corrupts or distracts from that message.</>
        )}
      </p>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#00ff88',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Signal = Activities that directly advance your primary objectives
        </p>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#ff6b6b',
          marginBottom: '0',
          fontWeight: '500'
        }}>
          Noise = Everything else that demands your attention
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Dies ist nicht dasselbe wie "wichtig vs unwichtig" oder "dringend vs nicht dringend." Signal vs Noise arbeitet auf einer tieferen Ebene—es geht darum zu unterscheiden zwischen dem, was dich zu deinen Zielen bewegt und dem, was sich nur wie Bewegung anfühlt.</>
        ) : (
          <>This isn't the same as "important vs unimportant" or "urgent vs non-urgent." Signal vs noise operates at a deeper level—it's about distinguishing between what moves you toward your goals and what merely feels like movement.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Die Kraft liegt in der Einfachheit. Anstatt komplexer Prioritätsmatrizen oder farbkodierter Systeme triffst du eine binäre Entscheidung pro Aufgabe: Signal oder Rauschen?</>
        ) : (
          <>The power lies in its simplicity. Instead of complex priority matrices or color-coded systems, you make one binary decision per task: Signal or noise?</>
        )}
      </p>

      {/* Signal vs Noise Waveform Visualization */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center',
        clear: 'both'
      }}>
        <img
          src="/blog-images/article-4-philosophy/signal-noise-waveform-wide.webp"
          alt="Information theory visualization showing pure signal wave versus noise interference and combined reality"
          style={{
            width: '100%',
            maxWidth: '800px',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid #333'
          }}
        />
        <p style={{
          fontSize: '0.8rem',
          color: '#666',
          marginTop: '1rem',
          fontStyle: 'italic',
          maxWidth: '700px',
          margin: '1rem auto 0'
        }}>
          Claude Shannon's breakthrough: distinguishing pure signal from noise interference in communication systems
        </p>
      </div>

      {/* Claude Shannon Portrait */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <img
          src="/blog-images/article-4-philosophy/claude-shannon-tribute.jpg"
          alt="Claude Shannon, Bell Labs engineer and father of information theory, mathematical foundation of Signal vs Noise"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #333',
            borderRadius: '8px'
          }}
        />
        <p style={{
          fontSize: '0.75rem',
          color: '#666',
          marginTop: '0.5rem',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Claude Shannon: Information theory pioneer, Bell Labs
        </p>
      </div>

      {/* Section: Information Theory Origins */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Ursprünge der Informationstheorie' : 'The Information Theory Origins'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Shannons Durchbruch entstand durch das Studium, wie Nachrichten degradieren, während sie durch Kommunikationskanäle reisen. Telefongespräche werden schwerer zu verstehen, wenn Rauschen im Verhältnis zur Signalstärke zunimmt.</>
        ) : (
          <>Shannon's breakthrough emerged from studying how messages degrade as they travel through communication channels. Telephone conversations become harder to understand as noise increases relative to signal strength.</>
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
          '"Ihre kognitive Kapazität ist der Kommunikationskanal. Ihre Ziele sind die beabsichtigte Nachricht. Alles, was um Ihre Aufmerksamkeit konkurriert, führt Rauschen in das System ein."'
        ) : (
          '"Your cognitive capacity is the communication channel. Your goals are the intended message. Everything competing for your attention introduces noise into the system."'
        )}
      </blockquote>

      <div style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid #00ff88',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <p style={{
          fontSize: '1rem',
          color: '#00ff88',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Mathematical Formula:
        </p>
        <p style={{
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'monospace',
          margin: '0'
        }}>
          Effectiveness = Signal Time / Total Working Time
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Jobs erkannte intuitiv, dass dieses Verhältnis 80/20 sein sollte. Musk strebt 100% Signal an. Die meisten Wissensarbeiter operieren bei etwa 30% Signal—was erklärt, warum Produktivität trotz ständiger Geschäftigkeit so schwer fassbar erscheint.</>
        ) : (
          <>Jobs intuited this ratio should be 80/20. Musk pushes toward 100% signal. Most knowledge workers operate at approximately 30% signal—explaining why productivity feels so elusive despite constant busyness.</>
        )}
      </p>

      {/* Section: Psychology of Binary Decision-Making */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Psychologie binärer Entscheidungsfindung' : 'The Psychology of Binary Decision-Making'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Traditionelle Produktivitätssysteme scheitern, weil sie zu viele kognitive Entscheidungen erfordern. David Allens Getting Things Done verwendet Kontextlisten, Prioritätsebenen und Überprüfungszyklen. Obwohl umfassend, erzeugt diese Komplexität ihre eigene Form von Rauschen.</>
        ) : (
          <>Traditional productivity systems fail because they require too many cognitive decisions. David Allen's Getting Things Done uses context lists, priority levels, and review cycles. While comprehensive, this complexity creates its own form of noise.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Signal vs Noise Denken nutzt was Psychologen "kognitive Leichtigkeit" nennen—die Präferenz des Gehirns für einfache, binäre Entscheidungen über komplexe Bewertungen.</>
        ) : (
          <>Signal vs noise thinking leverages what psychologists call "cognitive ease"—the brain's preference for simple, binary choices over complex evaluations.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Drei Produktivitätskiller eliminiert:' : 'Three Productivity Killers Eliminated:'}
      </h3>

      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#fff',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? '1. Analyse-Paralyse' : '1. Analysis Paralysis'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Anstatt mehrere Faktoren abzuwägen, bewertest du gegen ein einziges Kriterium: Signalfortschritt.'
            : 'Instead of weighing multiple factors, you evaluate against a single criterion: signal advancement.'
          }
        </p>
      </div>

      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#fff',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? '2. Prioritäts-Inflation' : '2. Priority Inflation'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Wenn alles wichtig erscheint, zwingt das Signal vs Noise Framework zur Rangordnung gegen deine Kernziele.'
            : 'When everything seems important, the signal vs noise framework forces rank ordering against your core objectives.'
          }
        </p>
      </div>

      <div style={{
        marginBottom: '3rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#fff',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? '3. Kontextwechsel-Overhead' : '3. Context Switching Overhead'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Binäre Klassifikation reduziert Entscheidungsmüdigkeit und bewahrt mentale Energie für Signalumsetzung.'
            : 'Binary classification reduces decision fatigue, preserving mental energy for signal execution.'
          }
        </p>
      </div>

      {/* Section: Real-World Applications */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Anwendungen in der realen Welt' : 'Real-World Applications'}
      </h2>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Tech-Industrie Adoption' : 'Tech Industry Adoption'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Das Silicon Valley hat Signal vs Noise Denken stillschweigend in mehreren Bereichen übernommen:</>
        ) : (
          <>Silicon Valley has quietly embraced signal vs noise thinking across multiple domains:</>
        )}
      </p>

      <ul style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem',
        paddingLeft: '1.5rem'
      }}>
        <li style={{ marginBottom: '0.8rem' }}>
          <strong style={{ color: '#00ff88' }}>
            {isGerman ? 'Produktentwicklung:' : 'Product Development:'}
          </strong>{' '}
          {isGerman
            ? 'Feature-Anfragen werden als Signal (Förderung des Kernnutzerwerts) oder Rauschen (Randfälle und Nice-to-haves) bewertet'
            : 'Feature requests are evaluated as signal (advancing core user value) or noise (edge cases and nice-to-haves)'
          }
        </li>
        <li style={{ marginBottom: '0.8rem' }}>
          <strong style={{ color: '#00ff88' }}>
            {isGerman ? 'Kommunikation:' : 'Communication:'}
          </strong>{' '}
          {isGerman
            ? 'Slack-Kanäle, E-Mail-Threads und Meetings durchlaufen Signal vs Noise Audits'
            : 'Slack channels, email threads, and meetings undergo signal vs noise audits'
          }
        </li>
        <li style={{ marginBottom: '0.8rem' }}>
          <strong style={{ color: '#00ff88' }}>Hiring:</strong>{' '}
          {isGerman
            ? 'Kandidaten werden auf Signal-Fähigkeiten (Kernkompetenzen) vs Rauschen-Referenzen (prestigeträchtige aber irrelevante Erfahrung) bewertet'
            : 'Candidates are assessed on signal skills (core competencies) vs noise credentials (prestigious but irrelevant experience)'
          }
        </li>
      </ul>

      {/* Statistics Box */}
      <div style={{
        backgroundColor: '#0a2818',
        border: '1px solid #00ff88',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          color: '#00ff88',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          {isGerman ? 'Wissenschaftliche Validierung:' : 'Academic Research Validation:'}
        </h4>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1rem'
        }}>
          {isGerman ? (
            <>Studien zeigen, dass Wissensarbeiter, die Single-Task-Fokus praktizieren (reine Signal-Perioden), folgendes demonstrieren:</>
          ) : (
            <>Studies show that knowledge workers who practice single-task focus (pure signal periods) demonstrate:</>
          )}
        </p>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>25%</strong> faster task completion
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>40%</strong> fewer errors
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong style={{ color: '#00ff88' }}>60%</strong> higher satisfaction scores
          </li>
        </ul>
      </div>

      {/* Implementation Section */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Signal vs Noise Methodik implementieren' : 'Implementing Signal vs Noise Methodology'}
      </h2>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Phase 1: Signal-Identifikation' : 'Phase 1: Signal Identification'}
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '1rem'
        }}>
          {isGerman ? (
            <>Beginne jede Woche mit der Definition deines primären Signals. Das ist keine Aufgabenliste—es ist dein übergeordnetes Ziel für die Woche.</>
          ) : (
            <>Begin each week by defining your primary signal. This isn't a task list—it's your overarching objective for the week.</>
          )}
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#999',
          marginBottom: '0',
          fontStyle: 'italic'
        }}>
          {isGerman ? 'Beispiele klarer Signale:' : 'Examples of Clear Signals:'} "Complete product prototype testing and gather user feedback"
        </p>
      </div>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          color: '#ff6b6b',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Phase 2: Rauschen-Audit' : 'Phase 2: Noise Audit'}
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman ? (
            <>Verfolge deine Zeit für eine Woche und kategorisiere jede Aktivität als Signal oder Rauschen. Die meisten Menschen entdecken, dass sie bei 20-30% Signal-Verhältnis operieren.</>
          ) : (
            <>Track your time for one week, categorizing every activity as signal or noise. Most people discover they're operating at 20-30% signal ratio.</>
          )}
        </p>
      </div>

      {/* App Integration */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Signal/Noise App: Digitale Umsetzung' : 'The Signal/Noise App: Digital Implementation'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die Signal/Noise Produktivitäts-App operationalisiert diese Philosophie durch Echtzeit-Klassifikation. Nutzer kategorisieren jede Aufgabe als Signal oder Rauschen und verfolgen dann ihr tägliches Verhältnis.</>
        ) : (
          <>The Signal/Noise productivity app operationalizes this philosophy through real-time classification. Users categorize each task as Signal or Noise, then track their daily ratio.</>
        )}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        margin: '2rem 0'
      }}>
        <div style={{
          backgroundColor: '#0a1f0a',
          border: '1px solid #00ff88',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            color: '#00ff88',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            {isGerman ? 'Binäre Aufgaben-Erstellung' : 'Binary Task Creation'}
          </h4>
          <p style={{
            fontSize: '0.9rem',
            color: '#ccc',
            marginBottom: '0'
          }}>
            {isGerman ? 'Keine Prioritätsebenen, keine Kategorien—nur Signal oder Rauschen Buttons.' : 'No priority levels, no categories—just Signal or Noise buttons.'}
          </p>
        </div>
        <div style={{
          backgroundColor: '#0a1f0a',
          border: '1px solid #00ff88',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            color: '#00ff88',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            {isGerman ? 'Echtzeit-Verhältnis-Tracking' : 'Real-Time Ratio Tracking'}
          </h4>
          <p style={{
            fontSize: '0.9rem',
            color: '#ccc',
            marginBottom: '0'
          }}>
            {isGerman ? 'Live-Prozentanzeige zeigt dein aktuelles Signal-zu-Rauschen-Verhältnis.' : 'Live percentage display showing your current signal-to-noise ratio.'}
          </p>
        </div>
      </div>

      {/* Challenge */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Deine Signal vs Noise Implementierungs-Challenge' : 'Your Signal vs Noise Implementation Challenge'}
      </h2>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '400'
      }}>
        {isGerman ? (
          <>Beginne morgen mit einer einfachen Änderung: Bevor du eine Aufgabe beginnst, frage dich "Ist das Signal oder Rauschen in Bezug auf mein primäres Ziel diese Woche?"</>
        ) : (
          <>Start tomorrow with one simple change: Before beginning any task, ask yourself "Is this signal or noise relative to my primary objective this week?"</>
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
          '"Wie Claude Shannon bei Telefonsystemen entdeckte, hängt die Qualität der Kommunikation nicht vom Volumen der übertragenen Informationen ab, sondern von der Klarheit des Signals im Verhältnis zum Rauschen."'
        ) : (
          '"As Claude Shannon discovered with telephone systems, the quality of communication depends not on the volume of information transmitted, but on the clarity of signal relative to noise."'
        )}
      </blockquote>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '400'
      }}>
        {isGerman ? (
          <>Dein Produktivitätsdurchbruch könnte nur eine binäre Entscheidung entfernt sein.</>
        ) : (
          <>Your productivity breakthrough might be one binary decision away.</>
        )}
      </p>

      {/* CTA */}
      <div style={{
        backgroundColor: '#0a2818',
        border: '2px solid #00ff88',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        margin: '3rem 0'
      }}>
        <p style={{
          fontSize: '1.1rem',
          color: '#fff',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          {isGerman ? 'Bereit, die Signal vs Noise Methodologie umzusetzen?' : 'Ready to implement signal vs noise methodology?'}
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#00ff88',
            color: '#000',
            textDecoration: 'none',
            padding: '0.8rem 2rem',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00cc6a';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00ff88';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isGerman ? 'App Starten' : 'Start Tracking'}
        </Link>
      </div>

      {/* Related Articles */}
      <div style={{
        borderTop: '1px solid #333',
        paddingTop: '2rem',
        marginTop: '3rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '400',
          color: '#999',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Verwandte Artikel' : 'Related Articles'}
        </h3>
        <div style={{
          display: 'grid',
          gap: '0.8rem'
        }}>
          <Link
            to="/blog/steve-jobs-method"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Steve Jobs\' Produktivitätsmethode' : 'Steve Jobs\' Productivity Method'}
          </Link>
          <Link
            to="/blog/kevin-oleary-was-right"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Kevin O\'Leary hatte Recht' : 'Kevin O\'Leary Was Right'}
          </Link>
          <Link
            to="/blog/founder-productivity-paradox"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Das Gründer-Paradoxon' : 'The Founder\'s Paradox'}
          </Link>
        </div>
      </div>
    </>
  );
}