import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../ImageModal';
import ArticleNavigation from '../ArticleNavigation';
import { getPreviousArticle, getNextArticle } from '../../utils/articleNavigation';

interface ArticleProps {
  isGerman: boolean;
}

export default function SignalVsNoisePhilosophyArticleV3({ isGerman }: ArticleProps) {
  const [modalImage, setModalImage] = useState<{src: string, alt: string, caption?: string} | null>(null);

  // Navigation logic
  const currentSlug = 'signal-vs-noise-philosophy';
  const previousArticle = getPreviousArticle(currentSlug);
  const nextArticle = getNextArticle(currentSlug);

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
          ? 'Signal vs Noise: Die Produktivitätsphilosophie, die alles verändert'
          : 'Signal vs Noise: The Productivity Philosophy That Changes Everything'}
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
          ? 'Wie die Informationstheorie zur Geheimwaffe der fokussiertesten Menschen wurde—und warum binäres Denken Ihr Produktivitätsdurchbruch sein könnte'
          : 'How information theory became the secret weapon of history\'s most focused achievers—and why binary thinking might be your productivity breakthrough'}
      </p>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        26 September 2024
      </div>

      {/* Claude Shannon Portrait with Text */}
      <div style={{
        float: 'left',
        marginRight: '2rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <img
          src="/blog-images/article-4-philosophy/claude-shannon-tribute.jpg"
          alt="Claude Shannon at Bell Labs, father of information theory"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #333',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-4-philosophy/claude-shannon-tribute.jpg",
            alt: "Claude Shannon at Bell Labs, father of information theory",
            caption: "Claude Shannon: Information theory pioneer, Bell Labs"
          })}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Steve Jobs verinnerlichte diese Philosophie. </>
        ) : (
          <>Steve Jobs internalized this philosophy. </>
        )}
        <Link
          to="/blog/steve-jobs-method"
          style={{
            color: '#00ff88',
            textDecoration: 'none',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {isGerman ? 'Entdecken Sie Steve Jobs\' spezifische Produktivitätsmethode →' : 'Learn about Steve Jobs\' specific productivity method →'}
        </Link>
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Elon Musk verkörpert sie vollständig. Und jetzt entsteht Signal vs Noise Denken als Gegenmittel zu unserem Zeitalter der Informationsüberflutung.</>
        ) : (
          <>Elon Musk embodies it completely. And now, Signal vs Noise thinking is emerging as the antidote to our age of information overload.</>
        )}
      </p>

      {/* Section: What Is Signal vs Noise */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem',
        clear: 'both'
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
          <>In Claude Shannons ursprünglichem Framework repräsentiert <strong style={{color: '#00ff88'}}>Signal</strong> die beabsichtigte Nachricht in jedem Kommunikationssystem, während <strong style={{color: '#ff6b6b'}}>Rauschen</strong> alle Interferenzen umfasst, die diese Nachricht verfälschen oder davon ablenken. Auf die Produktivität angewandt, entsteht ein binäres Klassifikationssystem, das die Komplexität der meisten Zeitmanagement-Ansätze durchschneidet.</>
        ) : (
          <>In Claude Shannon's original framework, <strong style={{color: '#00ff88'}}>signal</strong> represents the intended message in any communication system, while <strong style={{color: '#ff6b6b'}}>noise</strong> encompasses all the interference that corrupts or distracts from that message. Applied to productivity, this creates a binary classification system that cuts through the complexity plaguing most time management approaches.</>
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
          {isGerman ? 'Signal = Aktivitäten, die deine primären Ziele direkt vorantreiben' : 'Signal = Activities that directly advance your primary objectives'}
        </p>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#ff6b6b',
          marginBottom: '0',
          fontWeight: '500'
        }}>
          {isGerman ? 'Rauschen = Alles andere, was deine Aufmerksamkeit erfordert' : 'Noise = Everything else that demands your attention'}
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
            border: '1px solid #333',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-4-philosophy/signal-noise-waveform-wide.webp",
            alt: "Information theory visualization showing pure signal wave versus noise interference and combined reality",
            caption: "Visual representation of signal (clear peaks) versus noise (random fluctuations)"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <p style={{
          fontSize: '0.8rem',
          color: '#666',
          marginTop: '1rem',
          fontStyle: 'italic',
          maxWidth: '700px',
          margin: '1rem auto 0'
        }}>
          {isGerman ? 'Visuelle Darstellung von Signal (klare Spitzen) versus Rauschen (zufällige Schwankungen)' : 'Visual representation of signal (clear peaks) versus noise (random fluctuations)'}
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
          <>Shannons Durchbruch entstand durch das Studium, wie Nachrichten degradieren, während sie durch Kommunikationskanäle reisen. Telefongespräche werden schwerer zu verstehen, wenn Rauschen im Verhältnis zur Signalstärke zunimmt. Dasselbe Prinzip regiert die menschliche Aufmerksamkeit.</>
        ) : (
          <>Shannon's breakthrough emerged from studying how messages degrade as they travel through communication channels. Telephone conversations become harder to understand as noise increases relative to signal strength. The same principle governs human attention.</>
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
          {isGerman ? 'Die mathematische Beziehung ist präzise:' : 'The mathematical relationship is precise:'}
        </p>
        <p style={{
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'monospace',
          marginBottom: '1rem'
        }}>
          Signal-to-Noise Ratio = Signal Power / Noise Power
        </p>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'Auf Produktivität angewandt wird dies zu:' : 'When applied to productivity, this becomes:'}
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

      {/* Steve Jobs Portrait */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <img
          src="/blog-images/article-4-philosophy/steve-jobs-portrait.jpg"
          alt="Steve Jobs contemplating in minimalist workspace, demonstrating focused leadership philosophy"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #333',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-4-philosophy/steve-jobs-portrait.jpg",
            alt: "Steve Jobs contemplating in minimalist workspace, demonstrating focused leadership philosophy",
            caption: "Steve Jobs perfected the 80/20 signal-to-noise ratio"
          })}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        />
        <p style={{
          fontSize: '0.75rem',
          color: '#666',
          marginTop: '0.5rem',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Steve Jobs perfected the 80/20 signal-to-noise ratio
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Jobs erkannte intuitiv, dass dieses Verhältnis 80/20 sein sollte. </>
        ) : (
          <>Jobs intuited this ratio should be 80/20. </>
        )}
        <Link
          to="/blog/mathematics-productivity"
          style={{
            color: '#00ff88',
            textDecoration: 'none',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {isGerman ? 'Entdecken Sie die Mathematik hinter dem 80/20-Produktivitätsprinzip →' : 'Discover the mathematics behind the 80/20 productivity principle →'}
        </Link>
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Musk strebt 100% Signal an. Laut McKinsey-Forschung operieren die meisten Wissensarbeiter bei etwa 30% Signal—was erklärt, warum Produktivität trotz ständiger Geschäftigkeit so schwer fassbar erscheint.</>
        ) : (
          <>Musk pushes toward 100% signal. According to McKinsey research, most knowledge workers operate at approximately 30% signal—explaining why productivity feels so elusive despite constant busyness.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Der Unterschied zwischen 30% und 80% Signal ist nicht linear—er ist exponentiell. Wenn du 50% des Rauschens in deinem Tag eliminierst, gewinnst du nicht nur Zeit. Du gewinnst Klarheit, Schwung und die Verbundvorteile nachhaltigen Fokus.</>
        ) : (
          <>The difference between 30% and 80% signal isn't linear—it's exponential. When you eliminate 50% of the noise in your day, you don't just gain time. You gain clarity, momentum, and the compound benefits of sustained focus.</>
        )}
      </p>

      {/* Section: Psychology of Binary Decision-Making */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem',
        clear: 'both'
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
          <>Signal vs Noise Denken nutzt was Psychologen "kognitive Leichtigkeit" nennen—die Präferenz des Gehirns für einfache, binäre Entscheidungen über komplexe Bewertungen. Laut Daniel Kahnemans Forschung in "Schnelles Denken, langsames Denken" reduzieren binäre Entscheidungen die kognitive Belastung um bis zu 40%. Wenn du auf eine neue Aufgabe oder Gelegenheit stößt, stellst du dir eine Frage: "Fördert das mein primäres Signal oder ist es Rauschen?"</>
        ) : (
          <>Signal vs noise thinking leverages what psychologists call "cognitive ease"—the brain's preference for simple, binary choices over complex evaluations. According to Daniel Kahneman's research documented in "Thinking, Fast and Slow," binary decisions reduce cognitive load by up to 40%. When you encounter a new task or opportunity, you ask one question: "Does this advance my primary signal, or is it noise?"</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Dieses binäre Framework eliminiert drei Produktivitätskiller:' : 'This binary framework eliminates three productivity killers:'}
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

      {/* CTA Button */}
      <div style={{
        textAlign: 'center',
        margin: '3rem 0'
      }}>
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
          {isGerman ? 'Kostenlose Signal/Noise App testen →' : 'Try Signal/Noise App Free →'}
        </Link>
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

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Signal vs Noise Denken wurde stillschweigend in mehreren Bereichen übernommen, von Silicon Valley Startups bis zu akademischen Forschungslabors. Die Methodik erstreckt sich über individuelle Produktivität hinaus auf Teamdynamiken, strategische Planung und sogar persönliche Beziehungen.</>
        ) : (
          <>Signal vs noise thinking has been quietly adopted across multiple domains, from Silicon Valley startups to academic research labs. The methodology extends beyond individual productivity to team dynamics, strategic planning, and even personal relationships.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Wissenschaftliche Forschungsvalidierung' : 'Academic Research Validation'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Dr. Sophie Leroys Forschung zu "Aufmerksamkeitsrückständen", veröffentlicht im Journal für Organisationsverhalten und menschliche Entscheidungsprozesse, bietet wissenschaftliche Untermauerung für die Signal vs Noise Methodik. Wenn wir zwischen Aufgaben wechseln, bleibt ein Teil unserer Aufmerksamkeit bei der vorherigen Aktivität hängen. Diese Rückstände sammeln sich als Rauschen an und beeinträchtigen die Signalklarheit.</>
        ) : (
          <>Dr. Sophie Leroy's research on "attention residue" published in the Organizational Behavior and Human Decision Processes journal provides scientific backing for signal vs noise methodology. When we switch between tasks, part of our attention remains stuck on the previous activity. This residue accumulates as noise, degrading signal clarity.</>
        )}
      </p>

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
          {isGerman ? 'Studien zeigen, dass Wissensarbeiter, die Single-Task-Fokus praktizieren (reine Signal-Perioden), folgendes demonstrieren:' : 'Studies show that knowledge workers who practice single-task focus (pure signal periods) demonstrate:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>25%</strong> {isGerman ? ' schnellere Aufgabenerledigung' : ' faster task completion'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>40%</strong> {isGerman ? ' weniger Fehler' : ' fewer errors'}
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong style={{ color: '#00ff88' }}>60%</strong> {isGerman ? ' höhere Zufriedenheitswerte' : ' higher satisfaction scores'}
          </li>
        </ul>
      </div>

      {/* Section: Signal vs Noise vs Traditional Methods */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Signal vs Noise vs traditionelle Produktivitätsmethoden' : 'Signal vs Noise vs Traditional Productivity Methods'}
      </h2>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Der Getting Things Done Vergleich' : 'The Getting Things Done Comparison'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>David Allens GTD-System organisiert Aufgaben nach Kontext und Priorität. Signal vs Noise Denken organisiert nach Zielausrichtung. Eine Aufgabe kann in GTD "wichtig" sein und trotzdem Rauschen in Bezug auf deine primären Ziele darstellen.</>
        ) : (
          <>David Allen's GTD system organizes tasks by context and priority. Signal vs noise thinking organizes by purpose alignment. A task might be "important" in GTD while still being noise relative to your primary objectives.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Die Time Blocking Alternative' : 'The Time Blocking Alternative'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Cal Newports Time Blocking Methode, detailliert in seinem Buch "Deep Work", weist spezifische Stunden spezifischen Aktivitäten zu. Signal vs Noise Denken bestimmt, welche Aktivitäten überhaupt Zeitblöcke verdienen.</>
        ) : (
          <>Cal Newport's time blocking method, detailed in his book "Deep Work," assigns specific hours to specific activities. Signal vs noise thinking determines which activities deserve time blocks in the first place.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Die Pomodoro-Technik Verbesserung' : 'The Pomodoro Technique Enhancement'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Francesco Cirillos Pomodoro-Technik optimiert die Aufgabenerledigung. Signal vs Noise optimiert die Aufgabenauswahl.</>
        ) : (
          <>Francesco Cirillo's Pomodoro Technique optimizes task execution. Signal vs noise optimizes task selection.</>
        )}
      </p>

      {/* FAQ Section - simplified version of key questions */}
      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '2rem',
        margin: '3rem 0'
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '2rem',
          marginTop: '0'
        }}>
          {isGerman ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
        </h2>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '400',
            color: '#00ff88',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Wie berechne ich mein Signal-zu-Rauschen-Verhältnis?' : 'How do you calculate your signal-to-noise ratio?'}
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#ccc',
            marginBottom: '0'
          }}>
            {isGerman ? (
              <>Verfolgen Sie alle Ihre Aktivitäten für eine Woche, kategorisieren Sie jede als Signal (Förderung der primären Ziele) oder Rauschen (alles andere), dann teilen Sie die Signalstunden durch die gesamten Arbeitsstunden. Die meisten Wissensarbeiter operieren bei 30% Signal, während Spitzenperformer 80% erreichen.</>
            ) : (
              <>Track all your activities for one week, categorize each as either signal (advancing primary goals) or noise (everything else), then divide signal hours by total working hours. Most knowledge workers operate at 30% signal, while top performers maintain 80%.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '400',
            color: '#00ff88',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Ist Signal vs Noise dasselbe wie das 80/20-Prinzip?' : 'Is signal vs noise the same as the 80/20 principle?'}
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#ccc',
            marginBottom: '0'
          }}>
            {isGerman ? (
              <>Obwohl verwandt, unterscheiden sich Signal vs Noise und das 80/20-Prinzip (Pareto-Prinzip) leicht. Das 80/20-Prinzip identifiziert, dass 80% der Ergebnisse von 20% der Bemühungen kommen. Signal vs Noise geht darum, 80% Ihrer Zeit für Signal-Aktivitäten und nur 20% für Rauschen zu verwenden—es ist eine Zeitzuteilungsstrategie und nicht eine Ergebnisbeobachtung.</>
            ) : (
              <>While related, signal vs noise and the 80/20 principle (Pareto Principle) differ slightly. The 80/20 principle identifies that 80% of results come from 20% of efforts. Signal vs noise is about allocating 80% of your time to signal activities and only 20% to noise—it's a time allocation strategy rather than a results observation.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '0' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '400',
            color: '#00ff88',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Welche Tools helfen bei der Umsetzung der Signal vs Noise Methodologie?' : 'What tools help implement signal vs noise methodology?'}
          </h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#ccc',
            marginBottom: '0'
          }}>
            {isGerman ? (
              <>Die Signal/Noise App bietet dedizierte Verfolgung und Analyse. Alternativ verwenden Sie Zeit-Tracking-Apps mit binärer Kategorisierung, einfache Strichlisten oder Kalenderblöcke mit "Signal" und "Rauschen" Labels. Der Schlüssel ist konsistente Klassifikation und regelmäßige Verhältnisberechnung zur Aufrechterhaltung des Bewusstseins.</>
            ) : (
              <>The Signal/Noise app provides dedicated tracking and analysis. Alternatively, use time-tracking apps with binary categorization, simple tally sheets, or calendar blocking with "Signal" and "Noise" labels. The key is consistent classification and regular ratio calculation to maintain awareness.</>
            )}
          </p>
        </div>
      </div>

      {/* Final CTA */}
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
          {isGerman ? 'Bereit, Ihre Signal vs Noise Reise zu beginnen?' : 'Ready to start your Signal vs Noise journey?'}
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
          {isGerman ? 'App Starten →' : 'Start Tracking →'}
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
            to="/blog/mathematics-productivity"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Die Mathematik der Produktivität' : 'The Mathematics of Productivity'}
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

      {/* Article Navigation */}
      <ArticleNavigation
        previousArticle={previousArticle}
        nextArticle={nextArticle}
        isGerman={isGerman}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={modalImage !== null}
        onClose={() => setModalImage(null)}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
        caption={modalImage?.caption}
      />
    </>
  );
}