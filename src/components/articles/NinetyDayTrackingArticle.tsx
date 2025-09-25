import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../ImageModal';
import ArticleNavigation from '../ArticleNavigation';
import { getPreviousArticle, getNextArticle } from '../../utils/articleNavigation';

interface ArticleProps {
  isGerman: boolean;
}

export default function NinetyDayTrackingArticle({ isGerman }: ArticleProps) {
  const [modalImage, setModalImage] = useState<{src: string, alt: string, caption?: string} | null>(null);

  // Navigation logic
  const currentSlug = '90-day-tracking-experiment';
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
          ? 'Mein 90-Tage Signal vs Noise Experiment: Schockierende Ergebnisse'
          : 'My 90-Day Signal vs Noise Experiment: Shocking Results'}
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
          ? 'Wie ich von 23% auf 81% Signal-Verhältnis kam—und warum Tag 47 alles veränderte'
          : 'How I went from 23% to 81% signal ratio—and why day 47 changed everything'}
      </p>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        20 October 2025
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
          <>Ich dachte, ich sei produktiv. 12-Stunden-Tage, endlose To-Do-Listen, ständige Geschäftigkeit. Dann begann ich, jede Aktivität als "Signal" oder "Rauschen" zu verfolgen.</>
        ) : (
          <>I thought I was productive. 12-hour days, endless to-do lists, constant busyness. Then I started tracking every activity as "Signal" or "Noise."</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die Ergebnisse waren erschütternd. In den ersten beiden Wochen lag mein Signal-Verhältnis bei schockierenden 23%. Von meinen täglichen 10 Arbeitsstunden erzeugten nur 2,3 Stunden tatsächlich Wert.</>
        ) : (
          <>The results were devastating. For the first two weeks, my signal ratio was a shocking 23%. Of my daily 10 working hours, only 2.3 hours actually created value.</>
        )}
      </p>

      {/* Before vs After Transformation */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center',
        clear: 'both'
      }}>
        <img
          src="/blog-images/article-5-90-day/productivity-before-after-comparison.webp"
          alt="90-day Signal vs Noise transformation showing dramatic improvement from 23% to 81% signal ratio with detailed metrics"
          style={{
            width: '100%',
            maxWidth: '900px',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid #333',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-5-90-day/productivity-before-after-comparison.webp",
            alt: "90-day Signal vs Noise transformation showing dramatic improvement from 23% to 81% signal ratio with detailed metrics",
            caption: "90-day transformation: From productivity chaos to systematic focus methodology"
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
          90-day transformation: From productivity chaos to systematic focus methodology
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Aber an Tag 47 geschah etwas Entscheidendes. Ein einziger Denkfehler, den ich korrigierte, katapultierte mein Signal-Verhältnis auf 81%—und verdoppelte meine tatsächliche Produktivität bei gleichzeitig kürzeren Arbeitszeiten.</>
        ) : (
          <>But on day 47, something pivotal happened. One mental shift I made catapulted my signal ratio to 81%—and doubled my actual productivity while working fewer hours.</>
        )}
      </p>

      {/* Section: The Brutal Truth */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die brutale Wahrheit über meine Produktivität' : 'The Brutal Truth About My Productivity'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Nach Kevin O'Learys Enthüllung über Steve Jobs' 80/20 Signal vs Noise Methode beschloss ich, meine eigene Produktivität wissenschaftlich zu verfolgen. Ich würde jeden Tag 90 Tage lang jede Aktivität in zwei Kategorien einteilen:</>
        ) : (
          <>After Kevin O'Leary's revelation about Steve Jobs' 80/20 Signal vs Noise method, I decided to scientifically track my own productivity. I would categorize every activity for 90 days into two buckets:</>
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
          Signal = Activities that directly advance my primary objectives
        </p>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#ff6b6b',
          marginBottom: '0',
          fontWeight: '500'
        }}>
          Noise = Everything else competing for my attention
        </p>
      </div>

      {/* Week by Week Breakdown */}
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Woche für Woche Aufschlüsselung:' : 'Week by Week Breakdown:'}
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
          {isGerman ? 'Woche 1-2: Der Schock (23% Signal)' : 'Week 1-2: The Shock (23% Signal)'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Von 10 Arbeitsstunden täglich waren nur 2,3 tatsächlich wertvoll. Der Rest? Sinnlose Meetings, endloses E-Mail-Checken, "Busy Work" das sich produktiv anfühlte.'
            : 'Of 10 daily work hours, only 2.3 were actually valuable. The rest? Pointless meetings, endless email checking, "busy work" that felt productive.'
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
          {isGerman ? 'Woche 3-6: Erste Verbesserungen (35% Signal)' : 'Week 3-6: First Improvements (35% Signal)'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Das Bewusstsein allein half bereits. Ich begann, Rauschen-Aktivitäten abzulehnen und mich auf Kernaufgaben zu konzentrieren. Immer noch schockierend niedrig.'
            : 'Awareness alone helped. I started declining noise activities and focusing on core tasks. Still shockingly low.'
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
          {isGerman ? 'Woche 7: Der entscheidende Tag 47 (81% Signal)' : 'Week 7: The Pivotal Day 47 (81% Signal)'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Ein einziger Durchbruch veränderte alles. Ich entdeckte, dass meine Definition von "Signal" falsch war.'
            : 'One breakthrough changed everything. I discovered my definition of "Signal" was wrong.'
          }
        </p>
      </div>

      {/* The Day 47 Breakthrough */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Der Tag-47-Durchbruch: Warum meine Signal-Definition falsch war' : 'The Day 47 Breakthrough: Why My Signal Definition Was Wrong'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Sechs Wochen lang hatte ich Signal als "wichtige Arbeit" definiert. Projektmeilensteine, Kundengespräche, Strategiesitzungen—alles schien Signal zu sein, wenn es "geschäftsbezogen" war.</>
        ) : (
          <>For six weeks, I had defined Signal as "important work." Project milestones, client calls, strategy sessions—everything seemed like Signal if it was "business-related."</>
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
          '"Die Erkenntnis, die alles veränderte: Signal ist nicht "wichtige Arbeit." Signal ist Arbeit, die mich direkt zu meinem Wochenziel bewegt."'
        ) : (
          '"The insight that changed everything: Signal isn\'t "important work." Signal is work that moves me directly toward my weekly objective."'
        )}
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>An Tag 47 definierte ich mein Wochenziel neu: "Launch MVP user testing by Friday." Plötzlich wurden 60% meiner "wichtigen" Arbeit zu Rauschen. Strategiesitzungen über Q4? Rauschen. Kundengespräche, die nicht über MVP-Testing waren? Rauschen. Projektaktualisierungen, die nicht zum Launch beitrugen? Rauschen.</>
        ) : (
          <>On day 47, I redefined my weekly objective: "Launch MVP user testing by Friday." Suddenly, 60% of my "important" work became noise. Strategy sessions about Q4? Noise. Client calls not about MVP testing? Noise. Project updates that didn't contribute to launch? Noise.</>
        )}
      </p>

      {/* Data Visualization */}
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
          {isGerman ? '90-Tage Signal-Verhältnis Progression:' : '90-Day Signal Ratio Progression:'}
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          fontSize: '1rem',
          color: '#ccc'
        }}>
          <div>
            <strong style={{ color: '#ff6b6b' }}>Days 1-14:</strong><br />
            Average: 23%<br />
            Hours: 2.3/10
          </div>
          <div>
            <strong style={{ color: '#ffcc00' }}>Days 15-46:</strong><br />
            Average: 35%<br />
            Hours: 3.5/10
          </div>
          <div>
            <strong style={{ color: '#00ff88' }}>Days 47-90:</strong><br />
            Average: 81%<br />
            Hours: 6.5/8
          </div>
        </div>
      </div>

      {/* The Three Critical Insights */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Drei kritische Erkenntnisse aus dem Experiment' : 'Three Critical Insights from the Experiment'}
      </h2>

      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? '1. Spezifizität ist alles' : '1. Specificity Is Everything'}
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Vage Ziele wie "am Projekt arbeiten" führen zu Rauschen-Inflation. Spezifische Wochenziele wie "MVP-Testing starten" schneiden Rauschen sofort ab.'
            : 'Vague goals like "work on project" lead to noise inflation. Specific weekly objectives like "launch MVP testing" cut noise immediately.'
          }
        </p>
      </div>

      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? '2. "Wichtig" ≠ Signal' : '2. "Important" ≠ Signal'}
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Der gefährlichste Feind der Produktivität ist wichtige Arbeit, die nicht zu deinem aktuellen Ziel beiträgt. Strategieplanung kann wichtig sein, aber wenn dein Wochenziel der Produktlaunch ist, ist es Rauschen.'
            : 'Productivity\'s most dangerous enemy is important work that doesn\'t contribute to your current objective. Strategy planning might be important, but if your weekly goal is product launch, it\'s noise.'
          }
        </p>
      </div>

      <div style={{
        marginBottom: '3rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? '3. Weniger Stunden, mehr Ergebnisse' : '3. Fewer Hours, More Results'}
        </h3>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'In den letzten 44 Tagen arbeitete ich 8 Stunden statt 10, aber erzielte 180% mehr messbare Ergebnisse. Das Signal vs Noise Framework eliminierte nicht nur schlechte Arbeit—es vervielfachte gute Arbeit.'
            : 'For the final 44 days, I worked 8 hours instead of 10 but achieved 180% more measurable results. The Signal vs Noise framework didn\'t just eliminate bad work—it multiplied good work.'
          }
        </p>
      </div>

      {/* The Weekly Objectives Revolution */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Revolution der Wochenziele' : 'The Weekly Objectives Revolution'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Der größte Durchbruch kam durch die Änderung meines Zeitrahmens. Anstatt täglicher To-Do-Listen definierte ich jeden Montag ein spezifisches, messbares Wochenziel. Alles andere wurde durch dieses Prisma bewertet.</>
        ) : (
          <>The biggest breakthrough came from changing my timeframe. Instead of daily to-do lists, I defined one specific, measurable weekly objective every Monday. Everything else was evaluated through this lens.</>
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
          {isGerman ? 'Beispiele erfolgreicher Wochenziele:' : 'Examples of Successful Weekly Objectives:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            "Complete user interviews with 15 beta testers by Friday"
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            "Launch payment system integration and process first transaction"
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            "Finalize partnership agreement with SupplierX including signed contract"
          </li>
          <li style={{ marginBottom: '0' }}>
            "Deploy mobile app to app stores with all required assets"
          </li>
        </ul>
      </div>

      {/* The Compound Effect */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Der Compound-Effekt: Warum 81% Signal lebensverändernd ist' : 'The Compound Effect: Why 81% Signal Is Life-Changing'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Nach 90 Tagen war der kumulative Effekt erschütternd. Mit einem 81% Signal-Verhältnis hatte ich in 3 Monaten mehr bedeutsame Arbeit geleistet als in den vorherigen 12 Monaten mit "traditioneller" Produktivität.</>
        ) : (
          <>After 90 days, the cumulative effect was staggering. With an 81% signal ratio, I had accomplished more meaningful work in 3 months than in the previous 12 months of "traditional" productivity.</>
        )}
      </p>

      {/* Results Box */}
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
          {isGerman ? 'Messbare 90-Tage Ergebnisse:' : 'Measurable 90-Day Results:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>3 major projects</strong> {isGerman ? 'erfolgreich gestartet' : 'successfully launched'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>47% reduction</strong> {isGerman ? 'in wöchentlichen Meetings' : 'in weekly meetings'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>2 hours daily</strong> {isGerman ? 'Zeit zurückgewonnen' : 'time reclaimed'}
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong style={{ color: '#00ff88' }}>180% increase</strong> {isGerman ? 'in messbaren Ergebnissen' : 'in measurable outcomes'}
          </li>
        </ul>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Aber die wichtigste Veränderung war psychologisch. Zum ersten Mal seit Jahren fühlte sich Arbeit zielgerichtet an. Jede Aktivität hatte einen klaren Zweck. Das Gefühl ständiger Geschäftigkeit ohne Fortschritt verschwand vollständig.</>
        ) : (
          <>But the most important change was psychological. For the first time in years, work felt purposeful. Every activity had clear intent. The feeling of constant busyness without progress vanished completely.</>
        )}
      </p>

      {/* Implementation Guide */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Dein eigenes 90-Tage Signal vs Noise Experiment' : 'Your Own 90-Day Signal vs Noise Experiment'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Basierend auf meinen Fehlern und Durchbrüchen, hier ist die optimierte Methode für dein eigenes Experiment:</>
        ) : (
          <>Based on my mistakes and breakthroughs, here's the optimized method for your own experiment:</>
        )}
      </p>

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
          {isGerman ? 'Woche 1: Baseline-Messung' : 'Week 1: Baseline Measurement'}
        </h3>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Verfolge jede Aktivität 7 Tage lang ohne Änderungen' : 'Track every activity for 7 days without changes'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Kategorisiere als Signal (Zielfördernd) oder Rauschen (Alles andere)' : 'Categorize as Signal (goal-advancing) or Noise (everything else)'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Berechne dein Baseline-Signal-Verhältnis' : 'Calculate your baseline signal ratio'}
          </li>
        </ul>
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
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Woche 2+: Das Framework implementieren' : 'Week 2+: Implement the Framework'}
        </h3>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Definiere jeden Montag EIN spezifisches Wochenziel' : 'Define ONE specific weekly objective every Monday'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Bewerte jede Aktivität: "Bewegt das mich zu meinem Wochenziel?"' : 'Evaluate every activity: "Does this move me toward my weekly objective?"'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Sage Nein zu allem Rauschen, egal wie "wichtig" es scheint' : 'Say no to all noise, regardless of how "important" it seems'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Verfolge täglich dein Signal-Verhältnis und optimiere wöchentlich' : 'Track your signal ratio daily and optimize weekly'}
          </li>
        </ul>
      </div>

      {/* Challenge CTA */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Deine Signal vs Noise Challenge startet jetzt' : 'Your Signal vs Noise Challenge Starts Now'}
      </h2>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '400'
      }}>
        {isGerman ? (
          <>Basierend auf meinem Experiment prognostiziere ich: Du operierst derzeit bei 20-40% Signal. Nach 90 Tagen konsequenter Anwendung wirst du bei 70-85% Signal liegen.</>
        ) : (
          <>Based on my experiment, I predict: you're currently operating at 20-40% signal. After 90 days of consistent application, you'll be at 70-85% signal.</>
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
          '"Die Frage ist nicht, ob du produktiv bist. Die Frage ist, ob du an den richtigen Dingen produktiv bist."'
        ) : (
          '"The question isn\'t whether you\'re productive. The question is whether you\'re productive on the right things."'
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
          <>Deine 90-Tage Transformation beginnt mit einer einzigen Entscheidung: Wirst du weiterhin "beschäftigt" sein, oder wirst du anfangen, Signal zu verfolgen?</>
        ) : (
          <>Your 90-day transformation starts with one decision: will you continue being "busy," or will you start tracking signal?</>
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
          {isGerman ? 'Bereit für dein eigenes 90-Tage Signal vs Noise Experiment?' : 'Ready for your own 90-day signal vs noise experiment?'}
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
          {isGerman ? 'Tracking starten' : 'Start Tracking'}
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