import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function MathematicsProductivityArticle({ isGerman }: ArticleProps) {
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
          ? 'Die Mathematik der Produktivität: Warum 80% Ihrer Aufgaben unwichtig sind'
          : 'The Mathematics of Productivity: Why 80% of Your Tasks Don\'t Matter'}
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
          ? 'Wie das Pareto-Prinzip zur mathematischen Grundlage für Steve Jobs\' Erfolg wurde'
          : 'How the Pareto Principle became the mathematical foundation for Steve Jobs\' success'}
      </p>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        3 November 2025
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
          <>1906 machte der italienische Ökonom Vilfredo Pareto eine Beobachtung, die revolutionieren sollte, wie wir Produktivität, Reichtum und menschliche Leistung verstehen. Beim Studium des Landbesitzes im Königreich Italien entdeckte er, dass 80% des Landes nur 20% der Bevölkerung gehörten.</>
        ) : (
          <>In 1906, Italian economist Vilfredo Pareto made an observation that would revolutionize how we understand productivity, wealth, and human achievement. While studying land ownership in the Kingdom of Italy, Pareto discovered that 80% of the land was owned by just 20% of the population.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das war kein Zufall. Es war Mathematik.</>
        ) : (
          <>This wasn't coincidence. It was mathematics.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Über ein Jahrhundert später sollte Kevin O'Leary miterleben, wie Steve Jobs dieses mathematische Prinzip anwandte, um Apple vom Rande des Bankrotts zum wertvollsten Unternehmen der Welt zu transformieren. Das Geheimnis lag nicht darin, härter zu arbeiten—es lag darin, die mathematische Realität zu verstehen, dass nicht alle Aufgaben gleich geschaffen sind.</>
        ) : (
          <>Over a century later, Kevin O'Leary would witness Steve Jobs apply this mathematical principle to transform Apple from near-bankruptcy to the world's most valuable company. The secret wasn't working harder—it was understanding the mathematical reality that not all tasks are created equal.</>
        )}
      </p>

      {/* Section: Mathematical Foundation */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die mathematische Grundlage der 80/20-Regel' : 'The Mathematical Foundation of the 80/20 Rule'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Das Pareto-Prinzip ist nicht nur eine Beobachtung—es wurzelt in der Potenzgesetz-Mathematik. Wenn sie auf einem Graphen aufgetragen werden, folgen viele natürliche und menschliche Systeme dem, was Mathematiker eine Pareto-Verteilung nennen, bei der ein kleiner Prozentsatz der Eingaben die Mehrheit der Ausgaben erzeugt.</>
        ) : (
          <>The Pareto Principle isn't just an observation—it's rooted in power law mathematics. When plotted on a graph, many natural and human systems follow what mathematicians call a Pareto distribution, where a small percentage of inputs generates the majority of outputs.</>
        )}
      </p>

      <div style={{
        backgroundColor: '#0a2818',
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
          {isGerman ? 'Die mathematische Formel:' : 'The Mathematical Formula:'}
        </p>
        <p style={{
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'monospace',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Wenn der Pareto-Index α = log₄5 ≈ 1.16, dann kommen genau 80% der Effekte von 20% der Ursachen.' : 'If the Pareto index α = log₄5 ≈ 1.16, then exactly 80% of effects come from 20% of causes.'}
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Diese Beziehung zeigt sich überall in der Natur:</>
        ) : (
          <>This relationship appears throughout nature:</>
        )}
      </p>

      <ul style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem',
        paddingLeft: '1.5rem'
      }}>
        <li style={{ marginBottom: '0.5rem' }}>
          {isGerman ? '80% der Erdbebenschäden stammen von 20% der Erdbeben' : '80% of earthquake damage comes from 20% of earthquakes'}
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          {isGerman ? '80% des Reichtums werden von 20% der Bevölkerung gehalten' : '80% of wealth is held by 20% of the population'}
        </li>
        <li style={{ marginBottom: '0.5rem' }}>
          {isGerman ? '80% der Software-Bugs stammen von 20% des Codes' : '80% of software bugs come from 20% of the code'}
        </li>
        <li style={{ marginBottom: '0' }}>
          {isGerman ? '80% der Produktivität stammt von 20% Ihrer Aufgaben' : '80% of productivity comes from 20% of your tasks'}
        </li>
      </ul>

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
          {isGerman ? 'Warum gerade 80/20?' : 'Why 80/20 Specifically?'}
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman ? (
            <>Das Verhältnis ergibt sich aus den mathematischen Eigenschaften von Potenzgesetz-Verteilungen. Während die genauen Prozentsätze variieren (manchmal 70/30, manchmal 90/10), bleibt das zugrunde liegende Muster konsistent: Eine kleine Minderheit von Ursachen erzeugt die große Mehrheit der Effekte.</>
          ) : (
            <>The ratio emerges from the mathematical properties of power law distributions. While the exact percentages vary (sometimes 70/30, sometimes 90/10), the underlying pattern remains consistent: a small minority of causes generates the vast majority of effects.</>
          )}
        </p>
      </div>

      {/* Pareto Distribution Mathematical Proof */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center',
        clear: 'both'
      }}>
        <img
          src="/blog-images/article-9-mathematics/pareto-mathematical-proof-academic.webp"
          alt="Pareto distribution mathematical curve showing power law formula α = log₄₅ ≈ 1.16 and precise 80/20 relationship"
          style={{
            width: '100%',
            maxWidth: '900px',
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
          Mathematical proof: The Pareto distribution curve demonstrates why 80% of results consistently come from 20% of efforts
        </p>
      </div>

      {/* Section: Power Laws vs Normal Distribution */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Potenzgesetze vs. Normalverteilungen in der Produktivität' : 'Power Laws vs Normal Distributions in Productivity'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die meisten Menschen denken intuitiv, dass Produktivität einer Normalverteilung folgt—dass alle Aufgaben ungefähr gleichmäßig zu den Ergebnissen beitragen. Diese Annahme treibt traditionelle Zeitmanagement-Ratschläge an: alles organisieren, systematisch priorisieren, härter in allen Bereichen arbeiten.</>
        ) : (
          <>Most people intuitively think productivity follows a normal distribution—that all tasks contribute roughly equally to results. This assumption drives traditional time management advice: organize everything, prioritize systematically, work harder across the board.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Aber Produktivität folgt tatsächlich einer Potenzgesetz-Verteilung. Einige wenige Aufgaben erzeugen massiven Wert. Die meisten Aufgaben erzeugen wenig Wert. Manche Aufgaben subtrahieren sogar Wert, indem sie Zeit verbrauchen, die für hocheffektive Aktivitäten verwendet werden könnte.</>
        ) : (
          <>But productivity actually follows a power law distribution. A few tasks generate massive value. Most tasks generate little value. Some tasks actively subtract value by consuming time that could be allocated to high-impact activities.</>
        )}
      </p>

      <div style={{
        backgroundColor: '#0a0a2a',
        border: '1px solid #6b6bff',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          color: '#6b6bff',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          {isGerman ? 'Mathematische Implikation:' : 'Mathematical Implication:'}
        </h4>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman ? (
            <>Die Optimierung Ihrer produktivsten 20% der Aktivitäten liefert exponentiell mehr Wert als die Optimierung Ihrer am wenigsten produktiven 80%.</>
          ) : (
            <>Optimizing your most productive 20% of activities delivers exponentially more value than optimizing your least productive 80%.</>
          )}
        </p>
      </div>

      {/* Section: Academic Research */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Wissenschaftliche Validierung von UC Berkeley' : 'The UC Berkeley Academic Validation'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Forschung von UC Berkeleys D-Lab demonstriert, wie sich Potenzgesetz-Verteilungen in Produktivitätskontexten manifestieren. Ihre Analyse zeigt, dass die Anstrengungsverteilung nach einer Pareto-Verteilung durchweg besser abschneidet als lineare Anstrengungsverteilung.</>
        ) : (
          <>Research from UC Berkeley's D-Lab demonstrates how power law distributions manifest in productivity contexts. Their analysis shows that effort allocation following a Pareto distribution consistently outperforms linear effort allocation.</>
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
          '"Eine Änderung einer Menge führt zu einer relevanten Änderung der anderen, mathematisch am besten als Potenzgesetz-Verteilung zwischen zwei Mengen beschrieben."'
        ) : (
          '"A change in one quantity results in a relevant change in the other, best mathematically described as a power law distribution between two quantities."'
        )}
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Übersetzung: Kleine Verbesserungen in Ihren wertvollsten Aktivitäten (den 20%) erzeugen überproportional große Verbesserungen in der Gesamtproduktivität.</>
        ) : (
          <>Translation: Small improvements in your highest-value activities (the 20%) generate disproportionately large improvements in overall productivity.</>
        )}
      </p>

      {/* Section: Historical Validation */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Historische Validierung: Von der Ökonomie zu Apple' : 'Historical Validation: From Economics to Apple'}
      </h2>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Originalforschung (1906)' : 'Original Research (1906)'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Paretos ursprüngliche Forschung zum italienischen Landbesitz enthüllte eine 80/20-Verteilung, die über mehrere Regionen und Zeiträume hinweg galt. Das war nicht kulturell—es war mathematisch.</>
        ) : (
          <>Pareto's original research on Italian land ownership revealed an 80/20 distribution that held across multiple regions and time periods. This wasn't cultural—it was mathematical.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Moderne ökonomische Validierung (2001)' : 'Modern Economic Validation (2001)'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Der Physiker Victor Yakovenko von der University of Maryland analysierte US-Steuerdaten von 1983 bis 2001 und fand heraus, dass die Einkommensverteilung unter den reichsten 1-3% der Bevölkerung Paretos Prinzip mit mathematischer Präzision folgt.</>
        ) : (
          <>University of Maryland physicist Victor Yakovenko analyzed US Internal Revenue Service data from 1983 to 2001, finding that income distribution among the richest 1-3% of the population follows Pareto's principle with mathematical precision.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Steve Jobs\' praktische Anwendung' : 'Steve Jobs\' Practical Application'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Als Jobs 1997 zu Apple zurückkehrte, wandte er Pareto-Denken auf die Produktstrategie an. Apples Produktlinie schrumpfte von über 300 Artikeln auf 4 Kernprodukte—eine Reduzierung von 93%. Der Umsatz stieg in den folgenden drei Jahren um 300%.</>
        ) : (
          <>When Jobs returned to Apple in 1997, he applied Pareto thinking to product strategy. Apple's product line shrank from over 300 items to 4 core products—a 93% reduction. Revenue increased 300% over the following three years.</>
        )}
      </p>

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
          {isGerman ? 'Mathematische Analyse:' : 'Mathematical Analysis:'}
        </h4>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman ? (
            <>Jobs identifizierte, dass etwa 20% von Apples Produkten 80% der Gewinne generierten. Durch die Eliminierung der 80% der Produkte, die nur 20% des Wertes beitrugen, befreite er Ressourcen, um die wertvollen 20% zu optimieren.</>
          ) : (
            <>Jobs identified that approximately 20% of Apple's products generated 80% of profits. By eliminating the 80% of products contributing only 20% of value, he freed resources to optimize the high-impact 20%.</>
          )}
        </p>
      </div>

      {/* Section: Cognitive Research */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Wissenschaft hinter ungleicher Aufgabenverteilung' : 'The Science Behind Unequal Task Distribution'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Dr. Sophie Leroys Forschung zu "Aufmerksamkeitsrückständen" liefert neurologische Beweise dafür, warum manche Aufgaben überproportionalen Wert erzeugen. Aufgaben mit hoher kognitiver Belastung (typischerweise Ihre 20% Signal-Aktivitäten) profitieren exponentiell von anhaltender Aufmerksamkeit.</>
        ) : (
          <>Dr. Sophie Leroy's research on "attention residue" provides neurological evidence for why some tasks generate disproportionate value. High-cognitive-load tasks (typically your 20% signal activities) benefit exponentially from sustained attention.</>
        )}
      </p>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
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
          {isGerman ? 'Forschungsergebnis:' : 'Research Finding:'}
        </h4>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman ? (
            <>Wissensarbeiter, die zwischen hochwertigen und niedrigwertigen Aufgaben wechseln, erleben eine 25%ige Leistungseinbuße bei hochwertigen Aufgaben, aber nur 5% Einbuße bei niedrigwertigen Aufgaben.</>
          ) : (
            <>Knowledge workers switching between high-value and low-value tasks experience 25% performance degradation on high-value tasks, but only 5% degradation on low-value tasks.</>
          )}
        </p>
      </div>

      {/* Section: Information Theory Framework */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Informationstheoretisches mathematisches Framework' : 'Information Theory Mathematical Framework'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Claude Shannons Informationstheorie bietet die mathematische Grundlage für Signal vs Noise Produktivität. In jedem Kommunikationssystem muss die Signalstärke die Rauschstärke übertreffen für eine bedeutungsvolle Übertragung.</>
        ) : (
          <>Claude Shannon's information theory provides the mathematical foundation for signal vs noise productivity. In any communication system, signal power must exceed noise power for meaningful transmission.</>
        )}
      </p>

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
          {isGerman ? 'Angewandt auf Produktivität:' : 'Applied to Productivity:'}
        </p>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1rem',
          paddingLeft: '1.5rem'
        }}>
          <li>{isGerman ? 'Ihre kognitive Kapazität ist der Kommunikationskanal' : 'Your cognitive capacity is the communication channel'}</li>
          <li>{isGerman ? 'Hochwertige Aufgaben sind Signal' : 'High-value tasks are signal'}</li>
          <li>{isGerman ? 'Niedrigwertige Aufgaben sind Rauschen' : 'Low-value tasks are noise'}</li>
        </ul>
        <p style={{
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'monospace',
          marginBottom: '1rem'
        }}>
          SNR = Signal Power / Noise Power
        </p>
        <div style={{
          fontSize: '1rem',
          color: '#ccc'
        }}>
          <p><strong>Jobs' Anwendung:</strong> 80% Signal, 20% Rauschen = SNR von 4:1</p>
          <p><strong>Musks Evolution:</strong> ~95% Signal, 5% Rauschen = SNR von 19:1</p>
        </div>
      </div>

      {/* Section: Modern Research */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Mathematischer Beweis in moderner Produktivitätsforschung' : 'Mathematical Proof in Modern Productivity Research'}
      </h2>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Bildungsstudie 2014' : '2014 Educational Study'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Forscher testeten Studenten, die auf dem Pareto-Prinzip basierende Lernauswahl verwendeten, gegen Kontrollgruppen mit traditioneller Zeitverteilung. Studenten, die 80/20-Denken anwandten, erzielten 28% bessere Ergebnisse bei standardisierten Tests trotz 35% weniger Gesamtlernzeit.</>
        ) : (
          <>Researchers tested students using Pareto Principle-based study selection against control groups using traditional time allocation. Students applying 80/20 thinking scored 28% higher on standardized tests despite studying 35% fewer total hours.</>
        )}
      </p>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
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
          {isGerman ? 'Mathematische Erklärung:' : 'Mathematical Explanation:'}
        </h4>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman ? (
            <>Durch die Konzentration von 80% der Lernzeit auf die 20% des Materials, das am wahrscheinlichsten in Prüfungen vorkommt, erzielten Studenten bessere Ergebnisse mit weniger Gesamtaufwand.</>
          ) : (
            <>By focusing 80% of study time on the 20% of material most likely to appear on exams, students achieved superior results with less total effort.</>
          )}
        </p>
      </div>

      {/* Section: Signal/Noise Mathematical Model */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Das Signal/Noise mathematische Modell' : 'The Signal/Noise Mathematical Model'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die Signal/Noise App operationalisiert Pareto-Prinzip-Mathematik durch Echtzeit-Verhältnis-Tracking. Benutzer kategorisieren Aufgaben als Signal (hochwertig) oder Rauschen (niedrigwertig) und optimieren dann in Richtung mathematischer Ziele.</>
        ) : (
          <>The Signal/Noise app operationalizes Pareto Principle mathematics through real-time ratio tracking. Users categorize tasks as Signal (high-value) or Noise (low-value), then optimize toward mathematical targets.</>
        )}
      </p>

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
          {isGerman ? 'Kern-Mathematisches Framework:' : 'Core Mathematical Framework:'}
        </h4>
        <p style={{
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'monospace',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Täglicher Produktivitätsscore = (Signal-Stunden / Gesamt-Stunden) × 100' : 'Daily Productivity Score = (Signal Hours / Total Hours) × 100'}
        </p>
        <h4 style={{
          fontSize: '1rem',
          color: '#00ff88',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          {isGerman ? 'Ziel-Optimierung:' : 'Target Optimization:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li>{isGerman ? 'Anfänger: 60% Signal (3:2 Verhältnis)' : 'Beginner: 60% signal (3:2 ratio)'}</li>
          <li>{isGerman ? 'Fortgeschritten: 70% Signal (7:3 Verhältnis)' : 'Intermediate: 70% signal (7:3 ratio)'}</li>
          <li>{isGerman ? 'Profi: 80% Signal (4:1 Verhältnis)' : 'Advanced: 80% signal (4:1 ratio)'}</li>
          <li>{isGerman ? 'Experte: 90% Signal (9:1 Verhältnis)' : 'Expert: 90% signal (9:1 ratio)'}</li>
        </ul>
      </div>

      {/* Section: Compound Effect */}
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Zinseszins-Effekt Mathematik' : 'Compound Effect Mathematics'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Kleine Verbesserungen im Signal-Verhältnis erzeugen exponentielle Produktivitätsgewinne aufgrund von Potenzgesetz-Effekten:</>
        ) : (
          <>Small improvements in signal ratio generate exponential productivity gains due to power law effects:</>
        )}
      </p>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
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
          {isGerman ? 'Beispielrechnung:' : 'Example Calculation:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Benutzer A: 50% Signal-Verhältnis = 4 Stunden Signal-Arbeit täglich' : 'User A: 50% signal ratio = 4 hours signal work daily'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Benutzer B: 80% Signal-Verhältnis = 6,4 Stunden Signal-Arbeit täglich' : 'User B: 80% signal ratio = 6.4 hours signal work daily'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>{isGerman ? 'Unterschied:' : 'Difference:'}</strong> {isGerman ? '60% mehr Signal-Arbeit' : '60% more signal work'}
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong style={{ color: '#00ff88' }}>{isGerman ? 'Zinseszins-Effekt:' : 'Compound Effect:'}</strong> {isGerman ? '85% höhere monatliche Leistung' : '85% higher monthly output'}
          </li>
        </ul>
      </div>

      {/* Section: Mathematical Misconceptions */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Häufige mathematische Missverständnisse' : 'Common Mathematical Misconceptions'}
      </h2>

      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#ff6b6b',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'Missverständnis 1: Lineare Verbesserung' : 'Misconception 1: Linear Improvement'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          <span style={{ color: '#ff6b6b', fontWeight: '500' }}>{isGerman ? 'Falsch:' : 'Wrong:'}</span> {isGerman ? '25% mehr Stunden arbeiten = 25% mehr Produktivität' : 'Working 25% more hours = 25% more productivity'}<br />
          <span style={{ color: '#00ff88', fontWeight: '500' }}>{isGerman ? 'Richtig:' : 'Right:'}</span> {isGerman ? 'Aufgabenauswahl optimieren kann Produktivität verdoppeln ohne Stunden zu erhöhen' : 'Optimizing task selection can double productivity without increasing hours'}
        </p>
      </div>

      <div style={{
        marginBottom: '1.5rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#ff6b6b',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'Missverständnis 2: Gleicher Aufgabenwert' : 'Misconception 2: Equal Task Value'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          <span style={{ color: '#ff6b6b', fontWeight: '500' }}>{isGerman ? 'Falsch:' : 'Wrong:'}</span> {isGerman ? 'Alle beruflichen Aufgaben tragen ungefähr gleich zu Ergebnissen bei' : 'All professional tasks contribute roughly equally to results'}<br />
          <span style={{ color: '#00ff88', fontWeight: '500' }}>{isGerman ? 'Richtig:' : 'Right:'}</span> {isGerman ? 'Aufgabenwert folgt Potenzgesetz-Verteilung mit extremer Ungleichheit' : 'Task value follows power law distribution with extreme inequality'}
        </p>
      </div>

      {/* Section: Your Challenge */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Ihre mathematische Produktivitäts-Challenge' : 'Your Mathematical Productivity Challenge'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Für die nächsten 7 Tage verfolgen Sie Ihre Aktivitäten und wenden mathematische Pareto-Analyse an:</>
        ) : (
          <>For the next 7 days, track your activities and apply mathematical Pareto analysis:</>
        )}
      </p>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <ol style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Notieren Sie die Zeit für jede Aktivität' : 'Record time spent on each activity'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Schätzen Sie den Wert-Output für jede Aktivität (0-10 Skala)' : 'Estimate value output for each activity (0-10 scale)'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Berechnen Sie Wert-Dichte: Wert-Output ÷ Investierte Zeit' : 'Calculate value density: Value Output ÷ Time Invested'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Ordnen Sie Aktivitäten nach Wert-Dichte' : 'Rank activities by value density'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Identifizieren Sie Ihre persönliche 80/20-Verteilung' : 'Identify your personal 80/20 distribution'}
          </li>
        </ol>
      </div>

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
          {isGerman ? 'Mathematische Vorhersage:' : 'Mathematical Prediction:'}
        </h4>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1rem'
        }}>
          {isGerman ? (
            <>Sie werden entdecken, dass 15-25% Ihrer Aktivitäten 75-85% Ihrer wertvollen Leistung erzeugen.</>
          ) : (
            <>You'll discover that 15-25% of your activities generate 75-85% of your valuable output.</>
          )}
        </p>
        <p style={{
          fontSize: '1rem',
          color: '#fff',
          marginBottom: '0',
          fontWeight: '500'
        }}>
          {isGerman ? 'Optimierungsstrategie: Eliminieren Sie die unteren 20%, expandieren Sie die oberen 20%, behalten Sie die mittleren 60%.' : 'Optimization Strategy: Eliminate bottom 20%, expand top 20%, maintain middle 60%.'}
        </p>
      </div>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '400'
      }}>
        {isGerman ? (
          <>Die Mathematik ist klar: Produktivität geht nicht darum, härter zu arbeiten oder Zeit besser zu verwalten. Es geht darum, die Potenzgesetz-Verteilung des Aufgabenwerts zu verstehen und entsprechend zu optimieren.</>
        ) : (
          <>The mathematics are clear: productivity isn't about working harder or managing time better. It's about understanding the power law distribution of task value and optimizing accordingly.</>
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
          '"Wie Vilfredo Pareto vor über einem Jahrhundert entdeckte, sind ungleiche Verteilungen keine Bugs im System—sie sind Features. Die Mathematik der Produktivität belohnt diejenigen, die diese fundamentale Wahrheit erkennen und entsprechend optimieren."'
        ) : (
          '"As Vilfredo Pareto discovered over a century ago, unequal distributions aren\'t bugs in the system—they\'re features. The mathematics of productivity rewards those who recognize this fundamental truth and optimize accordingly."'
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
          <>Ihr Produktivitätsdurchbruch versteckt sich in der Mathematik.</>
        ) : (
          <>Your productivity breakthrough is hiding in the math.</>
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
          {isGerman ? 'Bereit, mathematische Produktivitätsoptimierung anzuwenden?' : 'Ready to apply mathematical productivity optimization?'}
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
          {isGerman ? 'Wert-Verteilung verfolgen' : 'Start Tracking Value Distribution'}
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
            to="/blog/signal-vs-noise-philosophy"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Signal vs Noise: Eine Philosophie für das moderne Leben' : 'Signal vs Noise: A Philosophy for Modern Life'}
          </Link>
          <Link
            to="/blog/90-day-tracking-experiment"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Mein 90-Tage Signal vs Noise Experiment' : 'My 90-Day Signal vs Noise Experiment'}
          </Link>
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
        </div>
      </div>
    </>
  );
}