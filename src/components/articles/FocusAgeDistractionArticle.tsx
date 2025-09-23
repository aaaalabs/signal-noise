import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function FocusAgeDistractionArticle({ isGerman }: ArticleProps) {
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
          ? 'Fokus im Zeitalter der Ablenkung: Die neue digitale Realität'
          : 'Focus in the Age of Distraction: The New Digital Reality'}
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
          ? 'Warum digital minimalism und Signal vs Noise thinking die Supermacht des 21. Jahrhunderts sind'
          : 'Why digital minimalism and Signal vs Noise thinking are the 21st century superpower'}
      </p>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        27 October 2025
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
          <>Das durchschnittliche Smartphone wird 96 Mal pro Tag entsperrt. Alle 10 Minuten checken wir unsere E-Mails. Wir haben mehr Zugang zu Informationen als jede Generation vor uns—und sind weniger fokussiert denn je.</>
        ) : (
          <>The average smartphone is unlocked 96 times per day. We check our email every 10 minutes. We have more access to information than any generation before us—and are less focused than ever.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Cal Newport nannte es "Deep Work." Digital Minimalists sprechen von "attention resistance." Steve Jobs praktizierte es als Signal vs Noise thinking. Aber was bedeutet Fokus wirklich in einem Zeitalter, in dem Ablenkung zur Industrie geworden ist?</>
        ) : (
          <>Cal Newport called it "Deep Work." Digital minimalists speak of "attention resistance." Steve Jobs practiced it as Signal vs Noise thinking. But what does focus really mean in an age where distraction has become an industry?</>
        )}
      </p>

      {/* Focus vs Distraction Comparison */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center',
        clear: 'both'
      }}>
        <img
          src="/blog-images/article-8-focus/focus-vs-distraction-comparison.webp"
          alt="Focus vs distraction comparison showing attention economy statistics and deep work versus fragmented attention"
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
          The attention economy: 45+ minutes deep focus vs 11 seconds fragmented attention
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Die Antwort liegt nicht darin, Technologie zu vermeiden. Sie liegt darin, die kognitiven Prinzipien zu verstehen, die Fokus möglich machen—und sie systematisch gegen eine Welt zu verteidigen, die darauf ausgelegt ist, sie zu zerstören.</>
        ) : (
          <>The answer isn't avoiding technology. It's understanding the cognitive principles that make focus possible—and systematically defending them against a world designed to destroy them.</>
        )}
      </p>

      {/* Section: The Attention Economy War */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Der Krieg um die Aufmerksamkeitsökonomie' : 'The Attention Economy War'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Silicon Valley hat eine Billion-Dollar-Industrie aufgebaut, deren Geschäftsmodell darin besteht, deine Aufmerksamkeit zu ernten und an Werbetreibende zu verkaufen. Jede App, jede Benachrichtigung, jeder "nur kurz checken"-Moment ist das Ergebnis von jahrelanger Verhaltensforschung.</>
        ) : (
          <>Silicon Valley has built a trillion-dollar industry whose business model is harvesting your attention and selling it to advertisers. Every app, every notification, every "just checking" moment is the result of years of behavioral research.</>
        )}
      </p>

      <div style={{
        backgroundColor: '#2a0a0a',
        border: '1px solid #ff6b6b',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          color: '#ff6b6b',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          {isGerman ? 'Die Wissenschaft der Ablenkung:' : 'The Science of Distraction:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Variable Ratio Reinforcement:</strong> {isGerman ? 'Wie bei Spielautomaten' : 'Like slot machines'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Social Approval Loops:</strong> {isGerman ? 'Likes aktivieren Dopamin' : 'Likes trigger dopamine'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Fear of Missing Out:</strong> {isGerman ? 'FOMO als Designprinzip' : 'FOMO as design principle'}
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong>Infinite Scroll:</strong> {isGerman ? 'Kein natürlicher Endpunkt' : 'No natural stopping point'}
          </li>
        </ul>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das ist nicht Zufall. Ehemalige Google- und Facebook-Mitarbeiter wie Tristan Harris vom Center for Humane Technology warnen: "Diese Technologien sind darauf ausgelegt, deine Aufmerksamkeit zu entführen und dich in einem Zustand der ständigen partiellen Aufmerksamkeit zu halten."</>
        ) : (
          <>This isn't accidental. Former Google and Facebook employees like Tristan Harris from the Center for Humane Technology warn: "These technologies are designed to hijack your attention and keep you in a state of continuous partial attention."</>
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
          '"In einer Welt, in der jeder um deine Aufmerksamkeit kämpft, wird Fokus zur Supermacht."'
        ) : (
          '"In a world where everyone is fighting for your attention, focus becomes a superpower."'
        )}
      </blockquote>

      {/* Section: Digital Minimalism Principles */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Digital Minimalism: Mehr als nur weniger Apps' : 'Digital Minimalism: More Than Just Fewer Apps'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Cal Newport definiert Digital Minimalism als "eine Philosophie der Technologienutzung, bei der du deine Online-Zeit auf eine kleine Anzahl sorgfältig ausgewählter und optimierter Aktivitäten konzentrierst, die etwas stark unterstützen, was du schätzt, und dann alles andere glücklich verpasst."</>
        ) : (
          <>Cal Newport defines digital minimalism as "a philosophy of technology use in which you focus your online time on a small number of carefully selected and optimized activities that strongly support things you value, and then give everything else the heave-ho."</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das ist kein technophober Luddismus. Es ist intelligente Signal vs Noise Anwendung auf digitale Tools. Genau wie Steve Jobs erkannte, dass nicht alle Produkte gleich wertvoll sind, erkennen Digital Minimalists, dass nicht alle digitalen Aktivitäten gleich wertvoll sind.</>
        ) : (
          <>This isn't technophobic Luddism. It's intelligent Signal vs Noise application to digital tools. Just as Steve Jobs recognized that not all products are equally valuable, digital minimalists recognize that not all digital activities are equally valuable.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Die drei Grundprinzipien:' : 'The Three Core Principles:'}
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
          {isGerman ? '1. Clutter ist kostspielig' : '1. Clutter Is Costly'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Jede zusätzliche App, jeder Feed, jede Benachrichtigung reduziert deine Fähigkeit zu fokussierter Aufmerksamkeit. Kognitiver Overhead ist real.'
            : 'Every additional app, every feed, every notification reduces your ability for focused attention. Cognitive overhead is real.'
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
          {isGerman ? '2. Optimierung ist wichtig' : '2. Optimization Matters'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Es reicht nicht, weniger Tools zu nutzen. Du musst die Tools, die du behältst, so konfigurieren, dass sie maximalen Wert bei minimaler Ablenkung liefern.'
            : 'It\'s not enough to use fewer tools. You must configure the tools you keep to deliver maximum value with minimum distraction.'
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
          {isGerman ? '3. Intentionalität ist alles' : '3. Intentionality Is Everything'}
        </h4>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#ccc',
          marginBottom: '0'
        }}>
          {isGerman
            ? 'Jede Technologie in deinem Leben sollte einem spezifischen, von dir definierten Zweck dienen. Default-Nutzung ist der Feind des Fokus.'
            : 'Every technology in your life should serve a specific, user-defined purpose. Default usage is the enemy of focus.'
          }
        </p>
      </div>

      {/* Section: The Deep Work Revolution */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Deep Work Revolution' : 'The Deep Work Revolution'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Deep Work—professionelle Aktivitäten, die in einem Zustand ablenkungsfreier Konzentration durchgeführt werden—wird zur wichtigsten Fähigkeit in der Wissensökonomie. Cal Newports Forschung zeigt: In einer Welt voller oberflächlicher Arbeit werden diejenigen, die Deep Work beherrschen, unverhältnismäßig belohnt.</>
        ) : (
          <>Deep Work—professional activities performed in a state of distraction-free concentration—is becoming the most important skill in the knowledge economy. Cal Newport's research shows: In a world full of shallow work, those who master deep work will be disproportionately rewarded.</>
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
          {isGerman ? 'Deep Work Statistiken:' : 'Deep Work Statistics:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>23 minutes:</strong> {isGerman ? 'Zeit, um nach Unterbrechung wieder fokussiert zu sein' : 'Time to refocus after interruption'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>50%:</strong> {isGerman ? 'Produktivitätsverlust durch Multitasking' : 'Productivity loss from multitasking'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>3-4 hours:</strong> {isGerman ? 'Maximum täglicher Deep Work für Experten' : 'Maximum daily deep work for experts'}
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong style={{ color: '#00ff88' }}>10x:</strong> {isGerman ? 'Qualitätsunterschied zwischen Deep Work und Shallow Work' : 'Quality difference between deep work and shallow work'}
          </li>
        </ul>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das Signal vs Noise Framework ist die perfekte Ergänzung zu Deep Work. Während Deep Work lehrt, wie man fokussiert arbeitet, lehrt Signal vs Noise, woran man fokussiert arbeiten sollte. Die Kombination ist transformativ.</>
        ) : (
          <>The Signal vs Noise framework is the perfect complement to Deep Work. While Deep Work teaches how to work with focus, Signal vs Noise teaches what to focus on. The combination is transformative.</>
        )}
      </p>

      {/* Section: Technology Boundaries */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Technologie-Grenzen: Die neuen Produktivitätsregeln' : 'Technology Boundaries: The New Productivity Rules'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Fokussierte Menschen setzen klare Grenzen zwischen Signal-Technologie (Tools, die direkt zu ihren Zielen beitragen) und Noise-Technologie (alles andere). Diese Grenzen sind nicht verhandelbar.</>
        ) : (
          <>Focused people set clear boundaries between Signal technology (tools that directly contribute to their goals) and Noise technology (everything else). These boundaries are non-negotiable.</>
        )}
      </p>

      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '400',
        color: '#00ff88',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        {isGerman ? 'Evidenz-basierte Technologie-Grenzen:' : 'Evidence-Based Technology Boundaries:'}
      </h3>

      <div style={{
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '2rem 0'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'Smartphone-Protokolle' : 'Smartphone Protocols'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1.5rem',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Alle Benachrichtigungen außer Anrufen deaktiviert' : 'All notifications disabled except calls'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Social Media Apps entfernt oder zeitlich begrenzt' : 'Social media apps removed or time-limited'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Phone-freie Zonen: Schlafzimmer, Arbeitsplatz während Deep Work' : 'Phone-free zones: bedroom, workspace during deep work'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Bewusste Check-Zeiten statt reaktiver Nutzung' : 'Scheduled check times instead of reactive usage'}
          </li>
        </ul>

        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'E-Mail & Kommunikation' : 'Email & Communication'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1.5rem',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? '2-3 feste E-Mail-Zeiten pro Tag' : '2-3 designated email times per day'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Inbox Zero als Standard' : 'Inbox Zero as standard'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Autoresponder für Erwartungsmanagement' : 'Autoresponders for expectation management'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Sofortnachricht-Apps nur für echte Notfälle' : 'Instant messaging apps only for true emergencies'}
          </li>
        </ul>

        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#00ff88',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'Arbeitsplatz-Design' : 'Workspace Design'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Browser-Tabs auf Maximum 7 begrenzt' : 'Browser tabs limited to maximum 7'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Separate Browser für Arbeit und private Nutzung' : 'Separate browsers for work and personal use'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            {isGerman ? 'Website-Blocker während Deep Work Sessions' : 'Website blockers during deep work sessions'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Physischer Timer für fokussierte Arbeitsblöcke' : 'Physical timer for focused work blocks'}
          </li>
        </ul>
      </div>

      {/* Section: Attention Restoration */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Aufmerksamkeits-Wiederherstellung: Die vergessene Produktivitätswissenschaft' : 'Attention Restoration: The Forgotten Productivity Science'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die meisten Produktivitätssysteme ignorieren eine kritische Wahrheit: Aufmerksamkeit ist eine endliche Ressource, die aktiv regeneriert werden muss. Die Attention Restoration Theory (ART) zeigt, dass bestimmte Aktivitäten die kognitiven Reserven wieder auffüllen können.</>
        ) : (
          <>Most productivity systems ignore a critical truth: attention is a finite resource that must be actively regenerated. Attention Restoration Theory (ART) shows that certain activities can replenish cognitive reserves.</>
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
          {isGerman ? 'Wissenschaftlich validierte Erholungsaktivitäten:' : 'Scientifically Validated Restoration Activities:'}
        </h4>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>Nature exposure:</strong> {isGerman ? '20 Minuten im Freien steigern Fokus um 30%' : '20 minutes outdoors improves focus by 30%'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>Meditation:</strong> {isGerman ? '8 Wochen Training verbessern Aufmerksamkeitssteuerung' : '8 weeks training improves attention control'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#00ff88' }}>Physical exercise:</strong> {isGerman ? 'Aerober Sport erhöht kognitive Flexibilität' : 'Aerobic exercise increases cognitive flexibility'}
          </li>
          <li style={{ marginBottom: '0' }}>
            <strong style={{ color: '#00ff88' }}>Solitude:</strong> {isGerman ? 'Alleine Zeit ohne Stimulation regeneriert Aufmerksamkeit' : 'Alone time without stimulation regenerates attention'}
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
          <>Cal Newport empfiehlt "productive meditation"—strukturierte Reflexion über spezifische Probleme während körperlicher Aktivität ohne digitale Stimulation. Dies trainiert sowohl Fokus als auch regeneriert Aufmerksamkeitsreserven.</>
        ) : (
          <>Cal Newport recommends "productive meditation"—structured reflection on specific problems during physical activity without digital stimulation. This both trains focus and regenerates attention reserves.</>
        )}
      </p>

      {/* Section: Signal vs Noise for Digital Life */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Signal vs Noise für das digitale Leben' : 'Signal vs Noise for Digital Life'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Das Signal vs Noise Framework angewendet auf Technologie ist brutal einfach: Jede digitale Aktivität ist entweder Signal (trägt direkt zu deinen Zielen bei) oder Rauschen (alles andere). Es gibt keine neutrale Zone.</>
        ) : (
          <>The Signal vs Noise framework applied to technology is brutally simple: every digital activity is either Signal (directly contributes to your goals) or Noise (everything else). There's no neutral zone.</>
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
            {isGerman ? 'Digital Signal' : 'Digital Signal'}
          </h4>
          <ul style={{
            fontSize: '0.9rem',
            color: '#ccc',
            marginBottom: '0',
            paddingLeft: '1rem'
          }}>
            <li>{isGerman ? 'Zielfokussierte Recherche' : 'Goal-focused research'}</li>
            <li>{isGerman ? 'Direkte Kommunikation' : 'Direct communication'}</li>
            <li>{isGerman ? 'Skill-Building Content' : 'Skill-building content'}</li>
            <li>{isGerman ? 'Produktive Tools' : 'Productive tools'}</li>
          </ul>
        </div>
        <div style={{
          backgroundColor: '#1f0a0a',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            color: '#ff6b6b',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            {isGerman ? 'Digital Noise' : 'Digital Noise'}
          </h4>
          <ul style={{
            fontSize: '0.9rem',
            color: '#ccc',
            marginBottom: '0',
            paddingLeft: '1rem'
          }}>
            <li>{isGerman ? 'Endloses Scrollen' : 'Endless scrolling'}</li>
            <li>{isGerman ? 'News-Konsumption' : 'News consumption'}</li>
            <li>{isGerman ? 'Social Media Browsing' : 'Social media browsing'}</li>
            <li>{isGerman ? 'Clickbait Content' : 'Clickbait content'}</li>
          </ul>
        </div>
      </div>

      {/* Implementation Guide */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Dein 30-Tage Digital Minimalism Experiment' : 'Your 30-Day Digital Minimalism Experiment'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Basierend auf Cal Newports Forschung und dem Signal vs Noise Framework, hier ist ein strukturierter Ansatz zur Wiedererlangung deines Fokus:</>
        ) : (
          <>Based on Cal Newport's research and the Signal vs Noise framework, here's a structured approach to reclaiming your focus:</>
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
          {isGerman ? 'Woche 1: Digital Declutter' : 'Week 1: Digital Declutter'}
        </h3>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Entferne alle Social Media Apps vom Smartphone' : 'Remove all social media apps from smartphone'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Deaktiviere alle Benachrichtigungen außer Anrufen' : 'Disable all notifications except calls'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Installiere Website-Blocker für ablenkende Seiten' : 'Install website blockers for distracting sites'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Führe ein "Technologie-Audit" durch: Signal vs Noise' : 'Conduct a "technology audit": Signal vs Noise'}
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
          {isGerman ? 'Woche 2-3: Deep Work Establishment' : 'Week 2-3: Deep Work Establishment'}
        </h3>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Etabliere 2-3 feste Deep Work Blöcke täglich' : 'Establish 2-3 fixed deep work blocks daily'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Praktiziere "productive meditation" während des Gehens' : 'Practice "productive meditation" while walking'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Implementiere E-Mail-Batching (2x täglich)' : 'Implement email batching (2x daily)'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Erstelle physische Arbeitsumgebung ohne Ablenkungen' : 'Create physical workspace without distractions'}
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
          {isGerman ? 'Woche 4: Signal Optimization' : 'Week 4: Signal Optimization'}
        </h3>
        <ul style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '0',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Reintroduziere selektiv nur Signal-Technologien' : 'Selectively reintroduce only Signal technologies'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Optimiere verbliebene Tools für minimale Ablenkung' : 'Optimize remaining tools for minimal distraction'}
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            {isGerman ? 'Messe und verfolge dein tägliches Signal vs Noise Verhältnis' : 'Measure and track your daily Signal vs Noise ratio'}
          </li>
          <li style={{ marginBottom: '0' }}>
            {isGerman ? 'Etabliere digitale Sabbats (tech-freie Zeiten)' : 'Establish digital sabbaths (tech-free times)'}
          </li>
        </ul>
      </div>

      {/* Challenge */}
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: '300',
        color: '#fff',
        marginBottom: '1.5rem',
        marginTop: '3rem'
      }}>
        {isGerman ? 'Die Fokus-Supermacht entwickeln' : 'Developing the Focus Superpower'}
      </h2>

      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '400'
      }}>
        {isGerman ? (
          <>In einer Welt, die darauf ausgelegt ist, deine Aufmerksamkeit zu fragmentieren, wird die Fähigkeit zu fokussierter, tiefer Arbeit zum ultimativen Wettbewerbsvorteil. Die Kombination aus Digital Minimalism und Signal vs Noise Thinking ist deine Verteidigung gegen die Aufmerksamkeitsökonomie.</>
        ) : (
          <>In a world designed to fragment your attention, the ability to focus on deep, meaningful work becomes the ultimate competitive advantage. The combination of digital minimalism and Signal vs Noise thinking is your defense against the attention economy.</>
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
          '"Konzentration ist die Supermacht des 21. Jahrhunderts. In einer Welt voller Ablenkungen ist derjenige, der fokussiert bleiben kann, der Gewinner."'
        ) : (
          '"Concentration is the superpower of the 21st century. In a world full of distractions, the person who can stay focused is the one who wins."'
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
          <>Die Frage ist nicht, ob du produktiv sein kannst. Die Frage ist, ob du die Disziplin hast, Signal vom Rauschen zu trennen—jeden Tag, bei jeder Entscheidung, bei jeder Technologie, die um deine Aufmerksamkeit konkurriert.</>
        ) : (
          <>The question isn't whether you can be productive. The question is whether you have the discipline to separate signal from noise—every day, with every decision, with every technology competing for your attention.</>
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
          {isGerman ? 'Bereit, deine Fokus-Supermacht zu entwickeln?' : 'Ready to develop your focus superpower?'}
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
          {isGerman ? 'Signal vs Noise starten' : 'Start Signal vs Noise'}
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
        </div>
      </div>
    </>
  );
}