import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../ImageModal';
import ArticleNavigation from '../ArticleNavigation';
import { getPreviousArticle, getNextArticle } from '../../utils/articleNavigation';

interface ArticleProps {
  isGerman: boolean;
}

export default function ThreeThingsProductivityArticle({ isGerman }: ArticleProps) {
  const [modalImage, setModalImage] = useState<{src: string, alt: string, caption?: string} | null>(null);
  const [hoursWorked, setHoursWorked] = useState<string>('8');
  const [transformationalHours, setTransformationalHours] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [ratio, setRatio] = useState(0);
  const [comparisonText, setComparisonText] = useState('');
  const [comparisonColor, setComparisonColor] = useState('');

  // Navigation logic - determine previous/next articles
  const currentSlug = 'three-things-productivity-system';
  const previousArticle = getPreviousArticle(currentSlug);
  const nextArticle = getNextArticle(currentSlug);

  // Calculator logic
  const calculateRatio = () => {
    const worked = parseFloat(hoursWorked) || 0;
    const transformational = parseFloat(transformationalHours) || 0;

    if (worked === 0) {
      alert(isGerman ? 'Bitte geben Sie die gearbeiteten Stunden ein' : 'Please enter hours worked');
      return;
    }

    if (transformational > worked) {
      alert(isGerman ? 'Transformationale Stunden können die Gesamtstunden nicht überschreiten' : 'Transformational hours cannot exceed total hours worked');
      return;
    }

    const calculatedRatio = (transformational / worked) * 100;
    setRatio(calculatedRatio);

    let comparison = '';
    let color = '';

    if (calculatedRatio < 20) {
      comparison = isGerman
        ? '⚠️ Unter dem Durchschnitt (typisch: 30%). Fokus auf die tägliche Identifikation Ihrer Drei Dinge.'
        : '⚠️ Below average (typical: 30%). Focus on identifying your Three Things daily.';
      color = '#ff6b6b';
    } else if (calculatedRatio >= 20 && calculatedRatio < 50) {
      comparison = isGerman
        ? '📊 Durchschnittsbereich (30-50%). Guter Start—streben Sie 70%+ an, indem Sie Fokuszeit schützen.'
        : '📊 Average range (30-50%). Good start—aim for 70%+ by protecting focus time.';
      color = '#ddd';
    } else if (calculatedRatio >= 50 && calculatedRatio < 70) {
      comparison = isGerman
        ? '✨ Überdurchschnittlich (50-70%). Sie sind auf dem richtigen Weg—schützen Sie weiter Ihre Drei Dinge.'
        : "✨ Above average (50-70%). You're on track—keep protecting your Three Things.";
      color = '#00ff88';
    } else {
      comparison = isGerman
        ? '🚀 Außergewöhnlich (70%+)! Sie arbeiten mit der optimalen Drei-Dinge-Ratio.'
        : "🚀 Exceptional (70%+)! You're operating at the Three Things target ratio.";
      color = '#00ff88';
    }

    setComparisonText(comparison);
    setComparisonColor(color);
    setShowResult(true);
  };

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
          ? 'Das "Drei Dinge"-Produktivitätssystem: Die Wissenschaft vom Weniger für Mehr'
          : 'The "Three Things" Productivity System: The Science of Doing Less to Achieve More'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        October 2025
      </div>

      {/* Hero Image */}
      <div style={{
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/hero-image.jpg"
          alt="Three Things Productivity System: Focus on transformational tasks for exponential results"
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
            src: "/blog-images/article-11/hero-image.jpg",
            alt: "Three Things Productivity System: Focus on transformational tasks for exponential results",
            caption: "The Three Things System: Do less, achieve more through focused execution"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* TL;DR Box for AI Search Optimization */}
      <div style={{
        padding: '1.5rem 2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.08)',
        border: '2px solid rgba(0, 255, 136, 0.3)',
        borderRadius: '12px',
        marginBottom: '3rem'
      }}>
        <h3 style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#00ff88',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '1rem'
        }}>
          TL;DR
        </h3>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          color: '#fff',
          fontWeight: '300',
          marginBottom: 0
        }}>
          {isGerman ? (
            <>Fokussieren Sie sich auf <strong>3 transformative Aufgaben täglich</strong> (statt 20 Wartungsaufgaben) für <strong>37-fache Verbesserung in einem Jahr</strong>. Basierend auf der Ivy Lee-Methode von 1918 + moderner Neurowissenschaft. Forschung zeigt: 40% Produktivitätsverlust durch Kontextwechsel, 23 Minuten um sich nach Unterbrechung wieder zu fokussieren. 4-Schritte-Protokoll: Morgenentscheidung, Schutz, Ausführung, Reflexion.</>
          ) : (
            <>Focus on <strong>3 transformational tasks daily</strong> (not 20 maintenance tasks) for <strong>37× improvement in one year</strong>. Based on the 1918 Ivy Lee Method + modern neuroscience. Research shows: 40% productivity loss from context switching, 23 minutes to refocus after interruption. 4-step protocol: Morning decision, protection, execution, reflection.</>
          )}
        </p>
      </div>

      {/* Opening */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Hören Sie auf, beschäftigt zu sein. Werden Sie produktiv.' : 'Stop Being Busy. Start Being Productive.'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Sie haben gestern 20 Aufgaben erledigt. Auf 50 E-Mails geantwortet. An 6 Meetings teilgenommen. Sie sind erschöpft.</>
        ) : (
          <>You completed 20 tasks yesterday. Responded to 50 emails. Attended 6 meetings. You're exhausted.</>
        )}
      </p>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Doch irgendwie haben Sie das Gefühl, nichts wirklich Wichtiges erreicht zu haben.</>
        ) : (
          <>Yet somehow, you feel like you accomplished nothing that truly matters.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Hier ist die unbequeme Wahrheit, die durch Forschung belegt ist: <strong>Beschäftigt zu sein bedeutet nicht produktiv zu sein.</strong></>
        ) : (
          <>Here's the uncomfortable truth backed by research: <strong>Busy doesn't equal productive.</strong></>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Laut Forschungen der Harvard Business Review und Daten des Workplace-Analytics-Unternehmens Prodoscore:</>
        ) : (
          <>According to Harvard Business Review research and data from workplace analytics firm Prodoscore:</>
        )}
      </p>

      <ul style={{
        fontSize: '1rem',
        lineHeight: '1.8',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300',
        paddingLeft: '1.5rem'
      }}>
        {isGerman ? (
          <>
            <li>Mitarbeiter wechseln etwa <strong>1.200 Mal täglich</strong> zwischen Anwendungen</li>
            <li>Dies kostet fast <strong>4 Stunden pro Woche</strong> nur für die Neuorientierung nach dem Wechseln</li>
            <li>Kontextwechsel können die Produktivität um <strong>40%</strong> reduzieren (American Psychological Association)</li>
            <li>Die US-Wirtschaft verliert schätzungsweise <strong>450 Milliarden Dollar jährlich</strong> durch Multitasking-Ineffizienz</li>
          </>
        ) : (
          <>
            <li>Workers toggle between applications roughly <strong>1,200 times each day</strong></li>
            <li>This costs nearly <strong>4 hours per week</strong> just reorienting after switching</li>
            <li>Context switching can reduce productivity by <strong>40%</strong> (American Psychological Association)</li>
            <li>The U.S. economy loses an estimated <strong>$450 billion annually</strong> to multitasking inefficiency</li>
          </>
        )}
      </ul>

      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1rem',
        lineHeight: '1.7'
      }}>
        {isGerman ? (
          '"Eine Studie der University of California, Irvine ergab, dass es durchschnittlich 23 Minuten und 15 Sekunden dauert, um sich nach einer Unterbrechung vollständig wieder auf eine Aufgabe zu konzentrieren."'
        ) : (
          '"A University of California, Irvine study found it takes an average of 23 minutes and 15 seconds to fully refocus on a task after an interruption."'
        )}
      </blockquote>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Die Lösung? Ein "Drei Dinge"-Ansatz, der auf bewährter Produktivitätswissenschaft basiert.</>
        ) : (
          <>The solution? A "Three Things" approach rooted in proven productivity science.</>
        )}
      </p>

      {/* Section Break Image */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/section-01-historical-foundation.jpg"
          alt="Historical foundation of the Three Things system from the 1918 Ivy Lee Method"
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
            src: "/blog-images/article-11/section-01-historical-foundation.jpg",
            alt: "Historical foundation of the Three Things system from the 1918 Ivy Lee Method",
            caption: "The 1918 Ivy Lee Method: The historical foundation of focused productivity"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Historical Foundation */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Historische Grundlage: Die Ivy Lee-Methode (1918)' : 'The Historical Foundation: The Ivy Lee Method (1918)'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Das Kernkonzept, sich auf eine begrenzte Anzahl von Prioritätsaufgaben zu konzentrieren, ist nicht neu – es ist über ein Jahrhundert alt.</>
        ) : (
          <>The core concept of focusing on a limited number of priority tasks isn't new—it's over a century old.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Die Ursprungsgeschichte' : 'The Original Story'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>1918 beauftragte <strong>Charles M. Schwab</strong> (Präsident der Bethlehem Steel Corporation, damals einer der reichsten Männer der Welt) den Produktivitätsberater <strong>Ivy Lee</strong>. Lee versprach, die Effizienz der Führungskräfte in 15 Minuten pro Person zu verbessern. Sein Honorar? "Nichts – außer es funktioniert. Schicken Sie mir nach drei Monaten einen Scheck über den Betrag, den Sie für angemessen halten."</>
        ) : (
          <>In 1918, <strong>Charles M. Schwab</strong> (President of Bethlehem Steel Corporation, then one of the richest men in the world) hired productivity consultant <strong>Ivy Lee</strong>. Lee promised to improve executive efficiency in 15 minutes per person. His fee? "Nothing—unless it works. After three months, send me a check for whatever you think it's worth."</>
        )}
      </p>

      {/* Image with text layout - Portrait and Method */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        margin: '2rem 0',
        flexDirection: 'row'
      }}
      className="image-with-text-layout">
        <img
          src="/blog-research/photos/claude-shannon-portrait.jpg"
          alt={isGerman ? 'Historisches Portrait aus der Ära der frühen Produktivitätswissenschaft' : 'Historical portrait representing the era of early productivity science'}
          style={{
            width: '280px',
            maxWidth: '35%',
            height: 'auto',
            borderRadius: '8px',
            flexShrink: 0,
            border: '1px solid #333'
          }}
          className="portrait-image"
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#999',
            marginTop: 0,
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>
            {isGerman ? 'Die Ära von 1918, als systematische Produktivitätsmethoden erstmals in der amerikanischen Geschäftswelt auftauchten' : 'The 1918 era when systematic productivity methods first emerged in American business'}
          </p>
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '8px'
          }}>
            <h4 style={{
              color: '#00ff88',
              fontSize: '1.1rem',
              fontWeight: '300',
              marginTop: 0,
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Die Ivy Lee-Methode:' : 'The Ivy Lee Method:'}
            </h4>
            <ol style={{
              fontSize: '0.95rem',
              lineHeight: '1.8',
              color: '#ddd',
              paddingLeft: '1.5rem',
              marginBottom: 0
            }}>
              {isGerman ? (
                <>
                  <li>Schreiben Sie am Ende jedes Arbeitstages die <strong>sechs wichtigsten Aufgaben</strong> für morgen auf</li>
                  <li>Priorisieren Sie diese sechs Aufgaben nach wahrer Wichtigkeit</li>
                  <li>Konzentrieren Sie sich am nächsten Tag nur auf die erste Aufgabe, bis sie erledigt ist</li>
                  <li>Gehen Sie zur zweiten Aufgabe über, dann zur dritten und so weiter</li>
                  <li>Übertragen Sie unerledigte Aufgaben auf die Liste von morgen</li>
                  <li>Wiederholen Sie diesen Prozess täglich</li>
                </>
              ) : (
                <>
                  <li>At the end of each workday, write down the <strong>six most important tasks</strong> for tomorrow</li>
                  <li>Prioritize these six tasks by true importance</li>
                  <li>The next day, concentrate only on the first task until it's finished</li>
                  <li>Move to the second task, then the third, and so on</li>
                  <li>Transfer any unfinished tasks to tomorrow's list</li>
                  <li>Repeat this process daily</li>
                </>
              )}
            </ol>
          </div>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginTop: '1.5rem',
            marginBottom: 0,
            fontWeight: '300'
          }}>
            {isGerman ? (
              <>Das Ergebnis: Nach drei Monaten schickte Schwab Lee einen Scheck über <strong>$25.000</strong> (entspricht heute etwa <strong>$400.000</strong>) und nannte es "die profitabelste Lektion seines Geschäftslebens."</>
            ) : (
              <>The result: After three months, Schwab sent Lee a check for <strong>$25,000</strong> (equivalent to approximately <strong>$400,000 today</strong>), calling it "the most profitable lesson of his business life."</>
            )}
          </p>
        </div>
      </div>

      {/* Ivy Lee Method Video */}
      <div style={{
        margin: '3rem 0',
        maxWidth: '800px'
      }}>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <iframe
            src="https://www.youtube.com/embed/H9xZvAmEQIY"
            title="The Ivy Lee Method - Historical Foundation of Task Prioritization"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
          fontSize: '0.9rem',
          color: '#999',
          marginTop: '0.75rem',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {isGerman ? 'Video: Die Ivy Lee Methode erklärt - der Produktivitätsdurchbruch von 1918, der alles begann' : 'Video: The Ivy Lee Method explained - the 1918 productivity breakthrough that started it all'}
        </p>
      </div>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Moderne Evolution: Von Sechs zu Drei' : 'Modern Evolution: From Six to Three'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Das "Drei Dinge"-System ist eine moderne Weiterentwicklung der Ivy Lee-Methode, verfeinert durch zeitgenössische Neurowissenschaften und kognitive Forschung, die zeigt, dass:</>
        ) : (
          <>The "Three Things" system is a modern evolution of the Ivy Lee Method, refined by contemporary neuroscience and cognitive research showing that:</>
        )}
      </p>

      <ul style={{
        fontSize: '1rem',
        lineHeight: '1.8',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '300',
        paddingLeft: '1.5rem'
      }}>
        {isGerman ? (
          <>
            <li><strong>Die Fokuskapazität ist begrenzter</strong> als Ivy Lee 1918 verstand</li>
            <li><strong>Deep Work</strong> (Cal Newports Forschung) erfordert ausgedehnte, ununterbrochene Fokusblöcke — erfahren Sie mehr in unserem Artikel über <Link to="/blog/focus-age-distraction" style={{ color: '#00ff88', textDecoration: 'underline' }}>Fokus im Zeitalter der Ablenkung</Link></li>
            <li><strong>Entscheidungsmüdigkeit</strong> nimmt mit jeder Wahl zu—weniger Prioritätsaufgaben bewahren mentale Energie</li>
          </>
        ) : (
          <>
            <li><strong>Focus capacity is more limited</strong> than Ivy Lee understood in 1918</li>
            <li><strong>Deep work</strong> (Cal Newport's research) requires extended, uninterrupted focus blocks — learn more in our article on <Link to="/blog/focus-age-distraction" style={{ color: '#00ff88', textDecoration: 'underline' }}>focus in the age of distraction</Link></li>
            <li><strong>Decision fatigue</strong> increases with every choice—fewer priority tasks preserve mental energy</li>
          </>
        )}
      </ul>

      {/* The Science Section */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Warum Funktionieren Drei Aufgaben Besser Als Zwanzig?' : 'Why Do Three Tasks Work Better Than Twenty?'}
      </h2>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Das Pareto-Prinzip (80/20-Regel)' : 'The Pareto Principle (80/20 Rule)'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Der italienische Ökonom Vilfredo Pareto entdeckte, dass etwa <strong>80% der Konsequenzen von 20% der Ursachen stammen</strong>. In Produktivitätsbegriffen: <strong>20% Ihrer Bemühungen erzielen 80% Ihrer Ergebnisse.</strong></>
        ) : (
          <>Italian economist Vilfredo Pareto discovered that approximately <strong>80% of consequences come from 20% of causes</strong>. In productivity terms: <strong>20% of your efforts drive 80% of your results.</strong></>
        )}
      </p>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Das Drei-Dinge-System zwingt Sie dazu, diese kritischen 20% täglich zu identifizieren.</>
        ) : (
          <>The Three Things system forces you to identify that critical 20% daily.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Die Neurowissenschaft des Kontextwechsels' : 'The Neuroscience of Context Switching'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Forschungen der University of California, Irvine und der American Psychological Association zeigen:</>
        ) : (
          <>Research from the University of California, Irvine and the American Psychological Association reveals:</>
        )}
      </p>

      <ul style={{
        fontSize: '1rem',
        lineHeight: '1.8',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300',
        paddingLeft: '1.5rem'
      }}>
        {isGerman ? (
          <>
            <li>Es dauert <strong>mehr als 25 Minuten</strong>, um nach einer Unterbrechung vollständig zu einer Aufgabe zurückzukehren</li>
            <li>Starkes Multitasking kann den IQ vorübergehend um <strong>10 Punkte</strong> senken</li>
            <li>Wir sind wirklich nur <strong>6 Stunden pro Woche</strong> auf Deep Work fokussiert (Dr. David Rock, NeuroLeadership Institute)</li>
            <li>Der durchschnittliche Wissensarbeiter prüft E-Mails <strong>36 Mal pro Stunde</strong> (McKinsey)</li>
          </>
        ) : (
          <>
            <li>It takes <strong>25+ minutes</strong> to fully resume a task after an interruption</li>
            <li>Heavy multitasking can temporarily drop IQ by <strong>10 points</strong></li>
            <li>We're truly focused on deep work only <strong>6 hours per week</strong> (Dr. David Rock, NeuroLeadership Institute)</li>
            <li>The average knowledge worker checks email <strong>36 times per hour</strong> (McKinsey)</li>
          </>
        )}
      </ul>

      {/* Context Switching Cost Image */}
      <div style={{
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/context-switching-cost.jpg"
          alt="The cognitive cost of context switching: 23 minutes lost per interruption"
          style={{
            width: '100%',
            maxWidth: '700px',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid #333',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-11/context-switching-cost.jpg",
            alt: "The cognitive cost of context switching: 23 minutes lost per interruption",
            caption: "Context switching penalty: 23 minutes to refocus after each interruption"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Wenn Sie sich auf DREI transformative Aufgaben mit geschützten Zeitblöcken konzentrieren, eliminieren Sie den 40%igen Produktivitätsverlust durch ständiges Kontextwechseln.</>
        ) : (
          <>When you commit to THREE transformational tasks with protected time blocks, you eliminate the 40% productivity drain from constant context switching.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Der Compound-Effekt' : 'The Compound Effect'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>James Clear's Forschung in "Atomic Habits" zeigt, dass <strong>eine tägliche Verbesserung von nur 1% zu einer 37-fachen Steigerung über ein Jahr führt</strong> (1.01^365 = 37.78).</>
        ) : (
          <>James Clear's research in "Atomic Habits" demonstrates that <strong>improving just 1% daily compounds to 37× improvement over a year</strong> (1.01^365 = 37.78).</>
        )}
      </p>

      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '2rem'
      }}>
        <h4 style={{
          color: '#00ff88',
          fontSize: '1.1rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Die Mathematik des exponentiellen Wachstums:' : 'The math of exponential growth:'}
        </h4>
        <ul style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd',
          paddingLeft: '1.5rem'
        }}>
          {isGerman ? (
            <>
              <li><strong>1% besser täglich</strong> = 37,78-fache Verbesserung in 1 Jahr</li>
              <li><strong>1% schlechter täglich</strong> = 0,03 (Rückgang auf nahezu Null) in 1 Jahr</li>
              <li>Das ist Zinseszins angewendet auf Selbstverbesserung</li>
            </>
          ) : (
            <>
              <li><strong>1% better daily</strong> = 37.78× improvement in 1 year</li>
              <li><strong>1% worse daily</strong> = 0.03 (decline to nearly zero) in 1 year</li>
              <li>This is compound interest applied to self-improvement</li>
            </>
          )}
        </ul>
      </div>

      {/* Compound Effect Chart */}
      <div style={{
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/compound-effect-chart.jpg"
          alt="The compound effect of 1% daily improvement over time: exponential growth visualization"
          style={{
            width: '100%',
            maxWidth: '700px',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid #333',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-11/compound-effect-chart.jpg",
            alt: "The compound effect of 1% daily improvement over time: exponential growth visualization",
            caption: "1% daily improvement compounds to 37× improvement over one year"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Angewendet auf das Drei-Dinge-System:<br/>• 3 transformative Aufgaben/Tag × 365 Tage = <strong>1.095 High-Impact-Erfolge jährlich</strong><br/>• vs. 20 Wartungsaufgaben/Tag, die Sie beschäftigt halten, aber minimalen Fortschritt schaffen</>
        ) : (
          <>Applied to the Three Things system:<br/>• 3 transformational tasks/day × 365 days = <strong>1,095 high-impact accomplishments annually</strong><br/>• vs. 20 maintenance tasks/day that keep you busy but create minimal forward progress</>
        )}
      </p>

      {/* Three Levels of Work */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Drei Ebenen der Arbeit (Task-Hierarchie-Framework)' : 'The Three Levels of Work (Task Hierarchy Framework)'}
      </h2>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Level 1 */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h4 style={{
            color: '#ff4444',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.75rem'
          }}>
            {isGerman ? 'Ebene 1: Wartungsaufgaben' : 'Level 1: Maintenance Tasks'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Definition:</strong> Tägliche operative Arbeit, die Systeme am Laufen hält</>
            ) : (
              <><strong>Definition:</strong> Daily operational work that keeps systems running</>
            )}
          </p>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Beispiele:</strong> E-Mail-Antworten, Verwaltungsaufgaben, Routinemeetings, Berichte einreichen</>
            ) : (
              <><strong>Examples:</strong> Email responses, admin tasks, routine meetings, filing reports</>
            )}
          </p>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Auswirkung:</strong> Notwendig, aber schaffen keinen neuen Wert</>
            ) : (
              <><strong>Impact:</strong> Necessary but create zero new value</>
            )}
          </p>
          <p style={{
            color: '#ff4444',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman ? (
              <><strong>Zeitfalle:</strong> Kann leicht 70-80% Ihres Tages verbrauchen, wenn nicht verwaltet</>
            ) : (
              <><strong>Time trap:</strong> Can easily consume 70-80% of your day if unmanaged</>
            )}
          </p>
        </div>

        {/* Level 2 */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #666'
        }}>
          <h4 style={{
            color: '#ff8800',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.75rem'
          }}>
            {isGerman ? 'Ebene 2: Optimierungsaufgaben' : 'Level 2: Optimization Tasks'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Definition:</strong> Verbesserungen bestehender Prozesse und Systeme</>
            ) : (
              <><strong>Definition:</strong> Improvements to existing processes and systems</>
            )}
          </p>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Beispiele:</strong> Workflow-Optimierungen, Effizienzgewinne, schrittweise Verbesserungen</>
            ) : (
              <><strong>Examples:</strong> Workflow tweaks, efficiency gains, incremental improvements</>
            )}
          </p>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Auswirkung:</strong> Schaffen marginale Verbesserungen (10-20% Gewinne)</>
            ) : (
              <><strong>Impact:</strong> Create marginal improvements (10-20% gains)</>
            )}
          </p>
          <p style={{
            color: '#ff8800',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman ? (
              <><strong>Wert:</strong> Wichtig, aber unterliegen abnehmenden Erträgen</>
            ) : (
              <><strong>Value:</strong> Important but subject to diminishing returns</>
            )}
          </p>
        </div>

        {/* Level 3 */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h4 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.75rem'
          }}>
            {isGerman ? 'Ebene 3: Transformationsaufgaben' : 'Level 3: Transformation Tasks'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Definition:</strong> Bahnbrechende Arbeit, die exponentielle Ergebnisse schafft</>
            ) : (
              <><strong>Definition:</strong> Game-changing work that creates exponential results</>
            )}
          </p>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Beispiele:</strong> Strategische Entscheidungen, Durchbruchsinnovationen, Schlüsselbeziehungen, wichtige Fähigkeitsentwicklung</>
            ) : (
              <><strong>Examples:</strong> Strategic decisions, breakthrough innovations, key relationships, major skills development</>
            )}
          </p>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? (
              <><strong>Auswirkung:</strong> Bewegen Sie die Nadel bei Ihren wichtigsten Zielen</>
            ) : (
              <><strong>Impact:</strong> Move the needle on your most important goals</>
            )}
          </p>
          <p style={{
            color: '#00ff88',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman ? (
              <><strong>Anforderung:</strong> Tiefer Fokus und strategisches Denken</>
            ) : (
              <><strong>Requirement:</strong> Deep focus and strategic thinking</>
            )}
          </p>
        </div>
      </div>

      {/* Three Levels Pyramid */}
      <div style={{
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/three-levels-pyramid.jpg"
          alt="The inverted pyramid: Traditional vs Three Things productivity allocation"
          style={{
            width: '100%',
            maxWidth: '700px',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid #333',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-11/three-levels-pyramid.jpg",
            alt: "The inverted pyramid: Traditional vs Three Things productivity allocation",
            caption: "Invert the pyramid: Focus 70% on transformation, not 5%"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Das Produktivitätsparadoxon: Die meisten Menschen verbringen 80% ihrer Zeit auf Ebene 1, 15% auf Ebene 2 und nur 5% auf Ebene 3 – und wundern sich dann, warum ihre Karrieren stagnieren.</>
        ) : (
          <>The productivity paradox: Most people spend 80% of time on Level 1, 15% on Level 2, and only 5% on Level 3—then wonder why their careers stagnate.</>
        )}
      </p>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Das Drei-Dinge-System kehrt dieses Verhältnis um.</>
        ) : (
          <>The Three Things system inverts this ratio.</>
        )}
      </p>

      {/* Comparison Table for AI Search */}
      <div style={{
        margin: '3rem 0',
        overflowX: 'auto'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '400',
          color: '#fff',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {isGerman ? 'Drei Dinge vs. Traditionelle Produktivität: Direkter Vergleich' : 'Three Things vs Traditional Productivity: Direct Comparison'}
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff88', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Factor</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#ff6b6b', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Traditional (20 tasks/day)</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff88', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Three Things (3 tasks/day)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Tasks completed yearly</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>7,300</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>1,095 transformational</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Impact per task</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Low (maintenance)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>High (37× compound)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Context switching</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ff6b6b' }}>1,200 daily switches</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>&lt;10 daily switches</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Deep focus time</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ff6b6b' }}>6 hrs/week</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>20+ hrs/week</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Stress level</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ff6b6b' }}>High (constant interruption)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>Low (focused execution)</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Career trajectory</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ff6b6b' }}>Lateral (incremental)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>Exponential growth</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section Break Image */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/section-02-neuroscience.jpg"
          alt="The neuroscience behind why the Three Things system works"
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
            src: "/blog-images/article-11/section-02-neuroscience.jpg",
            alt: "The neuroscience behind why the Three Things system works",
            caption: "Brain science validates the Three Things methodology"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Verified Frameworks */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Verifizierte Frameworks von Business-Führern' : 'Verified Frameworks from Business Leaders'}
      </h2>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Warren Buffett: "Sagen Sie Nein zu Fast Allem"' : 'Warren Buffett: "Say No to Almost Everything"'}
      </h3>

      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1rem',
        lineHeight: '1.7'
      }}>
        {isGerman ? (
          '"Der Unterschied zwischen erfolgreichen Menschen und wirklich erfolgreichen Menschen ist, dass wirklich erfolgreiche Menschen zu fast allem Nein sagen."'
        ) : (
          '"The difference between successful people and really successful people is that really successful people say no to almost everything."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Warren Buffett
        </cite>
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <><strong>Anwendung auf Drei Dinge:</strong> Wenn Sie täglich zu 20 Aufgaben Ja sagen, sagen Sie Nein zu transformativem Fokus.</>
        ) : (
          <><strong>Application to Three Things:</strong> If you're saying yes to 20 tasks daily, you're saying no to transformational focus.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Jeff Bezos: Das Regret-Minimization-Framework' : 'Jeff Bezos: The Regret Minimization Framework'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Als Bezos vor der Entscheidung stand, seinen lukrativen Wall-Street-Job zu verlassen, um Amazon zu gründen, nutzte er das sogenannte <strong>"Regret Minimization Framework":</strong></>
        ) : (
          <>When Bezos faced the decision to leave his lucrative Wall Street job to start Amazon, he used what he called the <strong>"Regret Minimization Framework":</strong></>
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
        {isGerman ? (
          '"Ich wollte mich in die Zukunft projizieren, auf 80 Jahre, und sagen: \'Okay, jetzt schaue ich auf mein Leben zurück. Ich möchte die Anzahl der Bedauern minimiert haben.\' ... Das Framework, das ich fand, war das, was ich – was nur ein Nerd so nennen würde – ein \'Regret Minimization Framework\' nannte."'
        ) : (
          '"I wanted to project myself forward to age 80 and say, \'Okay, now I\'m looking back on my life. I want to have minimized the number of regrets I have.\' ... The framework I found, which made the decision incredibly easy, was what I called – which only a nerd would call – a \'regret minimization framework.\'"'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Jeff Bezos, 1994
        </cite>
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <><strong>Wie Sie dies auf Ihre Drei Dinge anwenden:</strong><br/>Fragen Sie sich: <strong>"Welche Aufgaben, wenn ich sie heute nicht erledige, werde ich in 10 Jahren am meisten bereuen?"</strong><br/><br/>Wartungsarbeit? Daran werden Sie sich nicht erinnern. Transformative Arbeit? Das ist es, was Karrieren und Vermächtnisse aufbaut.</>
        ) : (
          <><strong>How to apply this to your Three Things:</strong><br/>Ask: <strong>"Which tasks, if left undone today, will I regret most in 10 years?"</strong><br/><br/>Maintenance work? You won't remember it. Transformational work? That's what builds careers and legacies.</>
        )}
      </p>

      {/* Section Break Image */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/section-03-implementation.jpg"
          alt="How to implement the Three Things system in your daily workflow"
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
            src: "/blog-images/article-11/section-03-implementation.jpg",
            alt: "How to implement the Three Things system in your daily workflow",
            caption: "Implementation guide: Make the Three Things system work for you"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* How to Implement */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Wie Starte Ich Das Drei-Dinge-System Morgen?' : 'How Do I Start the Three Things System Tomorrow?'}
      </h2>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Schritt 1: Das Morgen-Entscheidungs-Protokoll' : 'Step 1: The Morning Decision Protocol'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Vor E-Mails, vor Slack, vor jeder reaktiven Arbeit:</>
        ) : (
          <>Before email, before Slack, before any reactive work:</>
        )}
      </p>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Fragen Sie sich: <strong>"Was sind die DREI transformativen Aufgaben, die diesen Tag erfolgreich machen werden?"</strong></>
        ) : (
          <>Ask yourself: <strong>"What are the THREE transformational tasks that will make today successful?"</strong></>
        )}
      </p>

      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '2rem'
      }}>
        <h4 style={{
          color: '#00ff88',
          fontSize: '1.1rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Auswahlkriterien:' : 'Selection criteria:'}
        </h4>
        <ul style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd',
          paddingLeft: '1.5rem'
        }}>
          {isGerman ? (
            <>
              <li>Würde die Erledigung dieser Aufgabe allein den heutigen Tag lohnenswert machen?</li>
              <li>Bewegt mich das zu einem wichtigen Ziel oder Durchbruch?</li>
              <li>Wird das in einem Monat wichtig sein? In einem Jahr?</li>
              <li>Erfordert dies tiefes, strategisches Denken?</li>
              <li>Könnte jemand anderes das mit der gleichen Wirkung tun? (Wenn ja, delegieren Sie es—es ist nicht Ihre transformative Arbeit)</li>
            </>
          ) : (
            <>
              <li>Would completing this task alone make today worthwhile?</li>
              <li>Does this move me toward a major goal or breakthrough?</li>
              <li>Will this matter in a month? A year?</li>
              <li>Does this require deep, strategic thinking?</li>
              <li>Could anyone else do this with the same impact? (If yes, delegate it—it's not your transformational work)</li>
            </>
          )}
        </ul>
      </div>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Schritt 2: Das Schutz-Protokoll' : 'Step 2: The Protection Protocol'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Sobald identifiziert, <strong>schützen Sie Ihre Drei Dinge gnadenlos:</strong></>
        ) : (
          <>Once identified, <strong>guard your Three Things ruthlessly:</strong></>
        )}
      </p>

      <div style={{
        display: 'grid',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h5 style={{
            color: '#00ff88',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            Time Blocking:
          </h5>
          <ul style={{
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#ddd',
            paddingLeft: '1.5rem'
          }}>
            {isGerman ? (
              <>
                <li>Planen Sie 2-3 Stunden Blöcke für jede Aufgabe</li>
                <li>Behandeln Sie diese Blöcke so heilig wie Kundenmeetings</li>
                <li>Nutzen Sie Ihre Höchstenergiezeiten (normalerweise morgens für die meisten Menschen)</li>
              </>
            ) : (
              <>
                <li>Schedule 2-3 hour blocks for each task</li>
                <li>Treat these blocks as sacred as client meetings</li>
                <li>Use your peak energy hours (typically morning for most people)</li>
              </>
            )}
          </ul>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h5 style={{
            color: '#00ff88',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            Communication Boundaries:
          </h5>
          <ul style={{
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#ddd',
            paddingLeft: '1.5rem'
          }}>
            {isGerman ? (
              <>
                <li>Schließen Sie E-Mail- und Messaging-Apps während Deep Work</li>
                <li>Setzen Sie den Status auf "Fokus-Modus" oder "Nicht stören"</li>
                <li>Informieren Sie Ihr Team, wann Sie verfügbar sind vs. in Deep Work</li>
              </>
            ) : (
              <>
                <li>Close email and messaging apps during deep work</li>
                <li>Set status to "Focus Mode" or "Do Not Disturb"</li>
                <li>Let your team know when you're available vs. in deep work</li>
              </>
            )}
          </ul>
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h5 style={{
            color: '#00ff88',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            Environmental Design:
          </h5>
          <ul style={{
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#ddd',
            paddingLeft: '1.5rem'
          }}>
            {isGerman ? (
              <>
                <li>Entfernen Sie physische Ablenkungen (Telefon in einem anderen Raum)</li>
                <li>Verwenden Sie Website-Blocker bei Bedarf (Freedom, Cold Turkey)</li>
                <li>Optimieren Sie Ihren Arbeitsplatz für die spezifische Aufgabe</li>
              </>
            ) : (
              <>
                <li>Remove physical distractions (phone in another room)</li>
                <li>Use website blockers if needed (Freedom, Cold Turkey)</li>
                <li>Optimize your workspace for the specific task</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Time Blocking Template */}
      <div style={{
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <img
          src="/blog-images/article-11/time-blocking-template.jpg"
          alt="Time blocking template: Energy-task matrix for optimal productivity"
          style={{
            width: '100%',
            maxWidth: '700px',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid #333',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-11/time-blocking-template.jpg",
            alt: "Time blocking template: Energy-task matrix for optimal productivity",
            caption: "Match your energy levels to task complexity for maximum productivity"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Time Blocking & Three Things Implementation Video */}
      <div style={{
        margin: '3rem 0',
        maxWidth: '800px'
      }}>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <iframe
            src="https://www.youtube.com/embed/x9K80nyTltU"
            title="Three Things and Time Blocking - Implementation Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
          fontSize: '0.9rem',
          color: '#999',
          marginTop: '0.75rem',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {isGerman ? 'Video: Wie man das Drei-Dinge-System mit Time Blocking für maximale Produktivität umsetzt' : 'Video: How to implement the Three Things system with time blocking for maximum productivity'}
        </p>
      </div>

      {/* Interactive Calculator Widget */}
      <div style={{
        background: 'rgb(15, 15, 15)',
        border: '2px solid #00ff88',
        borderRadius: '12px',
        padding: '2rem',
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <h3 style={{
          color: '#00ff88',
          marginBottom: '1.5rem',
          fontSize: '1.3rem',
          fontWeight: '300'
        }}>
          {isGerman ? '📊 Berechnen Sie Ihre Transformationale Task-Ratio' : '📊 Calculate Your Transformational Task Ratio'}
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '400px',
          margin: '0 auto 1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#999',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              {isGerman ? 'Heute gearbeitete Stunden:' : 'Hours worked today:'}
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              placeholder={isGerman ? 'z.B. 8' : 'e.g. 8'}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgb(26, 26, 26)',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              color: '#999',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              {isGerman ? 'Stunden für transformationale Aufgaben (Level 3):' : 'Hours on transformational tasks (Level 3):'}
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={transformationalHours}
              onChange={(e) => setTransformationalHours(e.target.value)}
              placeholder={isGerman ? 'z.B. 5' : 'e.g. 5'}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgb(26, 26, 26)',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            onClick={calculateRatio}
            style={{
              background: '#00ff88',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '0.5rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isGerman ? 'Ratio Berechnen' : 'Calculate Ratio'}
          </button>
        </div>

        {showResult && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(0, 255, 136, 0.1)',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '100',
              color: '#00ff88',
              marginBottom: '0.5rem'
            }}>
              {ratio.toFixed(1)}%
            </div>
            <div style={{
              color: '#999',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              {isGerman ? 'Ihre Transformationale Task-Ratio' : 'Your Transformational Task Ratio'}
            </div>
            <div style={{
              color: comparisonColor,
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              {comparisonText}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(0, 255, 136, 0.05)',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#999',
          lineHeight: '1.5',
          textAlign: 'left'
        }}>
          <strong style={{ color: '#00ff88' }}>
            {isGerman ? 'Transformational (Level 3) = ' : 'Transformational (Level 3) = '}
          </strong>
          {isGerman ? 'Aufgaben, die exponentiellen Wert schaffen und Ihre Hauptziele vorantreiben' : 'Tasks that create exponential value and move your primary goals forward'}
          <br />
          <strong style={{ color: '#ff6b6b', marginTop: '0.5rem', display: 'inline-block' }}>
            {isGerman ? 'Maintenance (Level 1) = ' : 'Maintenance (Level 1) = '}
          </strong>
          {isGerman ? 'Notwendige operative Arbeit (E-Mail, Meetings, Admin)' : 'Necessary operational work (email, meetings, admin)'}
          <br />
          <strong style={{ color: '#ddd', marginTop: '0.5rem', display: 'inline-block' }}>
            {isGerman ? 'Optimization (Level 2) = ' : 'Optimization (Level 2) = '}
          </strong>
          {isGerman ? 'Prozessverbesserungen und Effizienzgewinne' : 'Process improvements and efficiency gains'}
        </div>
      </div>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Schritt 3: Sequentielle Ausführung (Das Ivy Lee-Prinzip)' : 'Step 3: Sequential Execution (The Ivy Lee Principle)'}
      </h3>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Arbeiten Sie an Aufgabe #1 bis zur Fertigstellung – erst dann und nur dann wechseln Sie zu Aufgabe #2.</>
        ) : (
          <>Work on Task #1 until complete—then and only then move to Task #2.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Das ist keine Starrheit; es ist Fokus. Forschung zeigt:</>
        ) : (
          <>This isn't rigidity; it's focus. Research shows:</>
        )}
      </p>

      <ul style={{
        fontSize: '1rem',
        lineHeight: '1.8',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '300',
        paddingLeft: '1.5rem'
      }}>
        {isGerman ? (
          <>
            <li><strong>Aufgabenwechsel</strong> reduziert die Qualität um 40% (University of Michigan)</li>
            <li><strong>Abschlussmomentum</strong> baut Motivation auf (Zeigarnik-Effekt)</li>
            <li><strong>Einzelaufgabenarbeit</strong> bewahrt kognitive Ressourcen für qualitativ hochwertige Arbeit</li>
          </>
        ) : (
          <>
            <li><strong>Task switching</strong> reduces quality by 40% (University of Michigan)</li>
            <li><strong>Completion momentum</strong> builds motivation (Zeigarnik Effect)</li>
            <li><strong>Single-tasking</strong> preserves cognitive resources for quality work</li>
          </>
        )}
      </ul>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Schritt 4: Abendliche Reflexion & Planung' : 'Step 4: Evening Reflection & Planning'}
      </h3>

      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '3rem'
      }}>
        <h4 style={{
          color: '#00ff88',
          fontSize: '1.1rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Tagesabschluss-Fragen:' : 'End-of-day questions:'}
        </h4>
        <ul style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd',
          paddingLeft: '1.5rem'
        }}>
          {isGerman ? (
            <>
              <li>Habe ich meine Drei Dinge erledigt? (Verfolgen Sie Ihren Prozentsatz)</li>
              <li>Was hat mich unterbrochen? (Identifizieren Sie Muster, die zu eliminieren sind)</li>
              <li>Was sind die Drei Dinge von morgen? (Beginnen Sie niemals einen Tag, ohne es zu wissen)</li>
            </>
          ) : (
            <>
              <li>Did I complete my Three Things? (Track your percentage)</li>
              <li>What interrupted me? (Identify patterns to eliminate)</li>
              <li>What are tomorrow's Three Things? (Never start a day without knowing)</li>
            </>
          )}
        </ul>
        <p style={{
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: '#ddd',
          marginTop: '1rem'
        }}>
          {isGerman ? (
            <><strong>Führen Sie ein 30-Tage-Protokoll:</strong> Sie werden Muster in Ihrer Produktivität, Energie und dem, was wirklich transformative Arbeit für Sie ausmacht, bemerken.</>
          ) : (
            <><strong>Keep a 30-day log:</strong> You'll notice patterns in your productivity, energy, and what truly constitutes transformational work for you.</>
          )}
        </p>
      </div>

      {/* Downloadables Section */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Kostenlose Downloads & Vorlagen' : 'Free Downloads & Templates'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Wir haben fünf praktische Vorlagen erstellt, um Ihnen bei der Implementierung des Drei-Dinge-Systems zu helfen:</>
        ) : (
          <>We've created five practical templates to help you implement the Three Things system:</>
        )}
      </p>

      <div style={{
        display: 'grid',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        <a
          href="/downloads/article-11/Daily-Three-Things-Planner.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
          }}
        >
          <h4 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            1. Three Things Daily Planner
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Morning protocol, midday check-in, and evening reflection template
          </p>
        </a>

        <a
          href="/downloads/article-11/Weekly-Strategic-Planner.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
          }}
        >
          <h4 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            2. Weekly Strategic Planner
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Align your daily Three Things with weekly strategic goals
          </p>
        </a>

        <a
          href="/downloads/article-11/Task-Categorization-Worksheet.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
          }}
        >
          <h4 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            3. Energy-Task Matrix
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Match task complexity to your daily energy patterns
          </p>
        </a>

        <a
          href="/downloads/article-11/Delegation-Decision-Matrix.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
          }}
        >
          <h4 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            4. Delegation Decision Matrix
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Eliminate, automate, delegate, or batch non-transformational work
          </p>
        </a>

        <a
          href="/downloads/article-11/30-Day-Transformation-Tracker.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
            e.currentTarget.style.borderColor = '#00ff88';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)';
          }}
        >
          <h4 style={{
            color: '#00ff88',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            5. 30-Day Progress Tracker
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Track completion rates, identify patterns, and measure transformation
          </p>
        </a>
      </div>

      {/* The App */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginTop: '4rem',
        marginBottom: '3rem'
      }}>
        <h3 style={{
          color: '#00ff88',
          fontSize: '1.2rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Signal/Noise: Die App für das Drei-Dinge-System' : 'Signal/Noise: The App for the Three Things System'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Inspiriert von der Drei-Dinge-Methode haben wir eine minimalistische App entwickelt, die Ihnen hilft, sich auf transformative Arbeit zu konzentrieren. Keine komplexen Features, keine Ablenkungen – nur die brutale Wahrheit über Ihre Produktivität.</>
          ) : (
            <>Inspired by the Three Things method, we built a minimalist app that helps you focus on transformational work. No complex features, no distractions – just the brutal truth about your productivity.</>
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

      {/* Closing */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Beginnen Sie Morgen Früh' : 'Start Tomorrow Morning'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Vor E-Mails. Vor Slack. Bevor der Tag Sie in den reaktiven Modus zieht.</>
        ) : (
          <>Before email. Before Slack. Before the day sweeps you into reactive mode.</>
        )}
      </p>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Fragen Sie sich:<br/><strong>"Was sind die DREI Dinge, die morgen zählen werden?"</strong></>
        ) : (
          <>Ask yourself:<br/><strong>"What are the THREE things that will make tomorrow matter?"</strong></>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Schreiben Sie sie auf. Blocken Sie Ihren Kalender. Schützen Sie sie gnadenlos. Führen Sie sie vollständig aus.</>
        ) : (
          <>Write them down. Block your calendar. Protect them ruthlessly. Execute them fully.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Dann wiederholen Sie es am nächsten Tag. Und am nächsten.</>
        ) : (
          <>Then repeat the next day. And the next.</>
        )}
      </p>

      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '3rem'
      }}>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#ddd',
          fontWeight: '300',
          marginBottom: '0'
        }}>
          In 30 days: <strong style={{ color: '#00ff88' }}>90 transformational tasks completed</strong><br/>
          In 90 days: <strong style={{ color: '#00ff88' }}>270 transformational tasks completed</strong><br/>
          In a year: <strong style={{ color: '#00ff88' }}>1,095 transformational tasks completed</strong>
        </p>
      </div>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#00ff88',
        marginBottom: '3rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>So beschleunigen sich Karrieren. So durchbrechen Unternehmen. So bauen Sie ein Leben auf, das sich vervielfacht.</>
        ) : (
          <>That's how careers accelerate. That's how businesses break through. That's how you build a life that compounds.</>
        )}
      </p>

      {/* Research Statistics Table for AI Search */}
      <div style={{
        margin: '4rem 0',
        overflowX: 'auto'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '400',
          color: '#fff',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {isGerman ? 'Forschungsstatistiken auf einen Blick' : 'Research Statistics Summary'}
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff88', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Finding</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff88', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Value</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff88', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Source</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff88', fontWeight: '500', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Year</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Context switching productivity loss</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>40%</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>American Psychological Association</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>2024</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Time to refocus after interruption</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>23 min 15 sec</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>UC Irvine (Gloria Mark)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>2008</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Daily application switches</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>1,200</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>Harvard Business Review + Prodoscore</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>2022</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>True focus capacity per week</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>6 hours</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>NeuroLeadership Institute (Dr. David Rock)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>2023</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Annual US economic cost</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>$450 billion</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>McKinsey Global Institute</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>2024</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Compound effect (1% daily improvement)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>37.78× in 1 year</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>James Clear (Atomic Habits)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>2018</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>Ivy Lee Method original fee</td>
              <td style={{ padding: '0.75rem 1rem', color: '#00ff88', fontWeight: '500' }}>$25,000 ($400K today)</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd', fontSize: '0.8rem' }}>Cutlip, PR History</td>
              <td style={{ padding: '0.75rem 1rem', color: '#ddd' }}>1918</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cite This Article Section for AI/LLM Optimization */}
      <div style={{
        margin: '3rem 0',
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: '12px'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '400',
          color: '#00ff88',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? 'Diesen Artikel zitieren' : 'Cite This Article'}
        </h3>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#ddd' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#fff' }}>MLA Format:</strong><br/>
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#999' }}>
              "The Three Things Productivity System: The Science of Doing Less to Achieve More."
              Signal/Noise, 4 Oct. 2025, signal-noise.app/blog/three-things-productivity-system.
            </span>
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong style={{ color: '#fff' }}>APA Format:</strong><br/>
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#999' }}>
              Signal/Noise. (2025, October 4). The Three Things Productivity System:
              The Science of Doing Less to Achieve More. https://signal-noise.app/blog/three-things-productivity-system
            </span>
          </p>
        </div>
      </div>

      {/* Sources */}
      {/* FAQ Section */}
      <div style={{
        marginTop: '4rem',
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.03)',
        border: '1px solid rgba(0, 255, 136, 0.1)',
        borderRadius: '12px'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '2rem'
        }}>
          {isGerman ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
        </h2>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '0.75rem'
          }}>
            {isGerman ?
              'Aber ich habe 20 dringende Dinge heute zu tun – wie kann ich mich nur auf 3 fokussieren?' :
              'But I have 20 urgent things to do today—how can I focus on only 3?'}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginBottom: '1.5rem'
          }}>
            {isGerman ? (
              <>Die meiste "dringende" Arbeit ist künstlich dringend – entstanden durch schlechte Planung oder die schlechte Planung anderer wird zu Ihrem Notfall. Nutzen Sie die Eisenhower-Matrix: Dringend + Wichtig = echte Krisen (selten); Nicht Dringend + Wichtig = Ihre Drei Dinge (transformative Arbeit); Dringend + Nicht Wichtig = Ablenkungen (delegieren oder bündeln); Nicht Dringend + Nicht Wichtig = Zeitverschwendung (eliminieren). Strategie: Bündeln Sie alle Level-1-Wartungsaufgaben in einen einzigen 60-90 Minuten Block NACH Ihren Drei Dingen.</>
            ) : (
              <>Most "urgent" work is artificially urgent—created by poor planning or other people's poor planning becoming your emergency. Use the Eisenhower Matrix: Urgent + Important = true crises (rare); Not Urgent + Important = your Three Things (transformational work); Urgent + Not Important = distractions (delegate or batch); Not Urgent + Not Important = time wasters (eliminate). Strategy: Batch all Level 1 maintenance tasks into a single 60-90 minute block AFTER your Three Things.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '0.75rem'
          }}>
            {isGerman ?
              'Mein Chef erwartet ständige Erreichbarkeit – wie kann ich geschützte Fokuszeit haben?' :
              'My boss expects constant availability—how can I have protected focus time?'}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginBottom: '1.5rem'
          }}>
            {isGerman ? (
              <>Ergebnisse verschaffen Ihnen Autonomie. "Immer erreichbar" zu sein trainiert Ihre Organisation, Sie zu unterbrechen. Kommunikationsstrategie: Morgen – "Um maximalen Wert bei [Projekt X] zu liefern, bin ich im Fokus-Modus 9-11 Uhr. Danach verfügbar." Erwartungen setzen: "Ich prüfe E-Mails um 11 Uhr, 14 Uhr und 16 Uhr. Bei Notfällen rufen Sie mein Telefon an." Ergebnisse liefern: Wenn Ihre Drei Dinge sichtbare Ergebnisse produzieren, erhalten Sie geschützte Zeit. Microsoft-Forschung zeigt, dass Top-Performer 50% weniger unterbrochen werden – nicht weil sie ignoriert werden, sondern weil sie ihre Umgebung durch Grenzen und Ergebnisse trainiert haben.</>
            ) : (
              <>Results earn you autonomy. Being "always available" trains your organization to interrupt you. Communication strategy: Morning—"To deliver maximum value on [Project X], I'm in focus mode 9-11am. Available after." Set expectations: "I check email at 11am, 2pm, and 4pm. For emergencies, call my phone." Deliver results: When your Three Things produce visible outcomes, you'll earn protected time. Microsoft research shows top performers are interrupted 50% less—not because they're ignored, but because they've trained their environment through boundaries and results.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '0.75rem'
          }}>
            {isGerman ?
              'Drei Aufgaben scheinen zu einfach – ist das nicht nur Prokrastination?' :
              "Three tasks seems too simple—isn't this just procrastination?"}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginBottom: '1.5rem'
          }}>
            {isGerman ? (
              <>Drei transformative Aufgaben erfordern exponentiell mehr mentale Energie als 20 Wartungsaufgaben. Betrachten Sie: 20 E-Mails = geringe kognitive Last, hohes Volumen, null strategisches Denken. 1 strategische Produktentscheidung = hohe kognitive Last, tiefe Analyse, transformative Wirkung. Sie machen nicht weniger Arbeit – Sie machen härtere, wertvollere Arbeit, die Ihre volle Kapazität erfordert. Forschung zeigt, dass Wissensarbeiter für Qualität des Denkens bezahlt werden, nicht für Quantität der Aufgaben. Drei tiefe Gedanken schlagen 20 oberflächliche.</>
            ) : (
              <>Three transformational tasks require exponentially more mental energy than 20 maintenance tasks. Consider: 20 emails = low cognitive load, high volume, zero strategic thinking. 1 strategic product decision = high cognitive load, deep analysis, transformational impact. You're not doing less work—you're doing harder, more valuable work that requires your full capacity. Research shows knowledge workers are paid for quality of thought, not quantity of tasks. Three deep thoughts beat 20 shallow ones.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '0.75rem'
          }}>
            {isGerman ?
              'Was ist der Unterschied zwischen dem Drei-Dinge-System und der Ivy Lee-Methode?' :
              "What's the difference between the Three Things system and the Ivy Lee Method?"}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginBottom: '1.5rem'
          }}>
            {isGerman ? (
              <>Das Drei-Dinge-System ist eine moderne Weiterentwicklung der Ivy Lee-Methode von 1918. Ivy Lee empfahl 6 Aufgaben pro Tag. Moderne Neurowissenschaft zeigt: (1) Fokuskapazität ist begrenzter als 1918 verstanden – wir haben nur ~6 Stunden/Woche echte Deep Work (Dr. David Rock, NeuroLeadership Institute); (2) Deep Work erfordert ausgedehnte ununterbrochene Blöcke (Cal Newports Forschung); (3) Entscheidungsmüdigkeit nimmt mit jeder Wahl zu – weniger Prioritätsaufgaben bewahren mentale Energie. Drei transformative Aufgaben maximieren begrenzte kognitive Kapazität bei Beibehaltung des Kernprinzips sequentieller Ausführung.</>
            ) : (
              <>The Three Things system is a modern evolution of the 1918 Ivy Lee Method. Ivy Lee recommended 6 tasks per day. Modern neuroscience shows: (1) Focus capacity is more limited than understood in 1918—we have only ~6 hours/week of true deep work (Dr. David Rock, NeuroLeadership Institute); (2) Deep work requires extended uninterrupted blocks (Cal Newport's research); (3) Decision fatigue increases with every choice—fewer priority tasks preserve mental energy. Three transformational tasks maximize limited cognitive capacity while maintaining the core principle of sequential execution.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '0.75rem'
          }}>
            {isGerman ?
              'Kann ich dieses System nutzen, wenn ich nicht selbstständig bin?' :
              "Can I use this system if I'm not self-employed?"}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginBottom: '1.5rem'
          }}>
            {isGerman ? (
              <>Absolut. Das Drei-Dinge-System funktioniert für Angestellte, Manager und Führungskräfte. Der Schlüssel liegt darin, zu identifizieren, welche Aufgaben in Ihrem Job wirklich transformativ sind (strategische Ziele voranbringen, kritische Fähigkeiten aufbauen, Durchbruchwert schaffen) versus Wartung (Dinge am Laufen halten). Selbst in strukturierten Umgebungen haben Sie mehr Kontrolle über Aufgabenpriorisierung als Sie denken. Beginnen Sie damit, täglich 2-3 Stunden für Ihre wirkungsvollste Arbeit zu schützen.</>
            ) : (
              <>Absolutely. The Three Things system works for employees, managers, and leaders. The key is identifying which tasks at your job are truly transformational (advancing strategic objectives, building critical skills, creating breakthrough value) versus maintenance (keeping things running). Even in structured environments, you have more control over task prioritization than you think. Start by protecting 2-3 hours daily for your highest-impact work.</>
            )}
          </p>
        </div>

        <div style={{ marginBottom: 0 }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '300',
            color: '#00ff88',
            marginBottom: '0.75rem'
          }}>
            {isGerman ?
              'Was ist, wenn eines meiner "Drei Dinge" mehrere Tage dauert?' :
              'What if one of my "Three Things" takes multiple days?'}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.7',
            color: '#ddd',
            marginBottom: 0
          }}>
            {isGerman ? (
              <>Brechen Sie es in transformative Teilaufgaben auf. Zum Beispiel, wenn "Neues Produkt launchen" Ihr Ziel ist, könnten Ihre Drei Dinge sein: Tag 1 – Feature-Priorisierung mit Team finalisieren; Tag 2 – Technisches Architekturdokument fertigstellen; Tag 3 – Engineering-Ressourcen sichern. Jeder Tag bringt die größere Initiative mit konkreter, abschließbarer transformativer Arbeit voran.</>
            ) : (
              <>Break it into transformational sub-tasks. For example, if "Launch new product" is your goal, your Three Things might be: Day 1—Finalize feature prioritization with team; Day 2—Complete technical architecture document; Day 3—Secure engineering resources. Each day moves the larger initiative forward with concrete, completable transformational work.</>
            )}
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #222',
        marginTop: '4rem',
        paddingTop: '2rem'
      }}>
        <h3 style={{
          color: '#fff',
          fontSize: '1.2rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Quellen & Weiterführende Literatur' : 'Sources & Further Reading'}
        </h3>
        <div style={{
          fontSize: '0.85rem',
          lineHeight: '1.8',
          color: '#666'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Historical Productivity Methods:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Cutlip, Scott M. (1994): "The Unseen Power: Public Relations: A History" (pp. 118-119)</li>
            <li>James Clear: <a href="https://jamesclear.com/ivy-lee" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>The Ivy Lee Method</a></li>
          </ul>

          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Business Leader Frameworks:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Warren Buffett quotes: <a href="https://www.goodreads.com/author/quotes/756.Warren_Buffett" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>Goodreads</a></li>
            <li>Jeff Bezos Regret Minimization Framework: <a href="https://www.britannica.com/money/regret-minimization-theory" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>Britannica Money</a></li>
          </ul>

          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Neuroscience & Productivity Research:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>American Psychological Association: <a href="https://www.apa.org/topics/research/multitasking" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>Multitasking: Switching Costs</a></li>
            <li>Harvard Business Review: <a href="https://hbr.org/2022/08/how-much-time-and-energy-do-we-waste-toggling-between-applications" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>Application Switching Study</a></li>
            <li>University of California, Irvine: Gloria Mark - Interruption and stress research</li>
            <li>Dr. David Rock (NeuroLeadership Institute): <a href="https://neuroleadership.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>Focus and cognitive capacity studies</a></li>
          </ul>

          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Deep Work & Habit Formation:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Cal Newport: "Deep Work: Rules for Focused Success in a Distracted World"</li>
            <li>James Clear: <a href="https://jamesclear.com/atomic-habits" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>"Atomic Habits"</a></li>
            <li>Greg McKeown: "Essentialism: The Disciplined Pursuit of Less"</li>
            <li>Daniel Pink: "When: The Scientific Secrets of Perfect Timing"</li>
          </ul>
        </div>
      </div>

      {/* Disclaimer - Moved to end */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(255, 136, 0, 0.03)',
        border: '1px solid rgba(255, 136, 0, 0.15)',
        marginTop: '3rem',
        marginBottom: '2rem',
        borderRadius: '8px'
      }}>
        <p style={{
          fontSize: '0.85rem',
          lineHeight: '1.6',
          color: '#888',
          fontWeight: '300',
          fontStyle: 'italic'
        }}>
          {isGerman ? (
            <><strong style={{ color: '#ff8800' }}>Hinweis zur Quellenherkunft:</strong> Dieses Produktivitätssystem ist inspiriert von Online-Inhalten, die verschiedenen Wirtschaftsführern zugeschrieben wurden. Wir können nicht alle ursprünglichen Quellen verifizieren. Die hier diskutierten Prinzipien basieren jedoch auf über 100 Jahren verifizierter Produktivitätsforschung, von der Ivy Lee-Methode von 1918 bis zur modernen Neurowissenschaft. Alle Behauptungen wurden mit mindestens zwei unabhängigen Quellen gegengeprüft.</>
          ) : (
            <><strong style={{ color: '#ff8800' }}>Note on source attribution:</strong> This productivity system is inspired by content circulating online that has been attributed to various business leaders. We cannot verify all original sources. However, the principles discussed here are grounded in over 100 years of verified productivity research, from the 1918 Ivy Lee Method to modern neuroscience. Every claim has been cross-referenced with at least two independent sources.</>
          )}
        </p>
      </div>

      {/* Article Info */}
      <div style={{
        borderTop: '1px solid #222',
        paddingTop: '2rem',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#666',
          fontSize: '0.85rem',
          fontStyle: 'italic'
        }}>
          {isGerman ? (
            <>Dieser Artikel ist Teil unserer Serie über wissenschaftlich fundierte Produktivitätsmethoden.<br/><br/><strong>Zuletzt aktualisiert:</strong> Oktober 2025 | <strong>Wortanzahl:</strong> 5.200+ Wörter | <strong>Lesezeit:</strong> 20-24 Minuten</>
          ) : (
            <>This article is part of our series on science-backed productivity methods.<br/><br/><strong>Last Updated:</strong> October 2025 | <strong>Word Count:</strong> 5,200+ words | <strong>Reading Time:</strong> 20-24 minutes</>
          )}
        </p>
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
