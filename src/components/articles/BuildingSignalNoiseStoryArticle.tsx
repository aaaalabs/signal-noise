import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function BuildingSignalNoiseStoryArticle({ isGerman }: ArticleProps) {
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
          ? 'Building Signal/Noise: Von der Krise zur App'
          : 'Building Signal/Noise: From Crisis to App'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        10 November 2025
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
          <>Es war 3:47 Uhr morgens. Ich starrte auf meinen Laptop-Bildschirm, umgeben von 73 offenen Browser-Tabs, 4 To-Do-List-Apps und einem Gefühl der kompletten Überwältigung.</>
        ) : (
          <>It was 3:47 AM. I was staring at my laptop screen, surrounded by 73 open browser tabs, 4 todo list apps, and a complete sense of overwhelm.</>
        )}
      </p>

      {/* Personal Crisis Opening */}
      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das war der Moment, der alles veränderte. Der Moment, in dem ich realisierte, dass ich nicht produktiver wurde – ich wurde nur beschäftigter. Die Ironie war brutal: Als Gründer von drei Technologie-Unternehmen half ich anderen dabei, fokussiert zu bleiben, während ich selbst im Chaos aus endlosen Aufgaben ertrank.</>
        ) : (
          <>That was the moment that changed everything. The moment I realized I wasn't getting more productive—I was just getting busier. The irony was brutal: as the founder of three technology companies helping others stay focused, I was drowning in an endless sea of tasks myself.</>
        )}
      </p>

      {/* The Breaking Point */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Der Zusammenbruch' : 'The Breaking Point'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Meine Produktivitätskrise hatte konkrete Zahlen: 247 unbearbeitete E-Mails, 89 "dringende" Slack-Nachrichten, 34 Kalenderereignisse für die Woche und 156 Aufgaben verteilt auf fünf verschiedene Produktivitäts-Apps. Ich verbrachte mehr Zeit damit, meine Produktivitätssysteme zu verwalten, als tatsächlich produktiv zu sein.</>
        ) : (
          <>My productivity crisis had concrete numbers: 247 unread emails, 89 "urgent" Slack messages, 34 calendar events for the week, and 156 tasks spread across five different productivity apps. I was spending more time managing my productivity systems than actually being productive.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das Paradoxon war offensichtlich: Je mehr Tools ich hinzufügte, desto weniger fokussiert wurde ich. Jede neue App versprach die ultimative Lösung, aber sie alle hatten dasselbe Problem – sie behandelten alle Aufgaben als gleich wichtig. Ein 2-Minuten-E-Mail-Check hatte denselben Stellenwert wie die strategische Planung für das nächste Quartal.</>
        ) : (
          <>The paradox was obvious: the more tools I added, the less focused I became. Every new app promised the ultimate solution, but they all had the same problem—they treated all tasks as equally important. A 2-minute email check had the same weight as strategic planning for the next quarter.</>
        )}
      </p>

      {/* The Discovery */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Entdeckung' : 'The Discovery'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die Lösung kam von einem unerwarteten Ort: einem Kevin O'Leary Interview über Steve Jobs. O'Leary beschrieb, wie Jobs seine Tage in nur zwei Kategorien einteilte: "Signal" und "Noise." Signal waren die wenigen Dinge, die tatsächlich wichtig waren. Noise war alles andere.</>
        ) : (
          <>The solution came from an unexpected place: a Kevin O'Leary interview about Steve Jobs. O'Leary described how Jobs divided his days into just two categories: "Signal" and "Noise." Signal was the few things that actually mattered. Noise was everything else.</>
        )}
      </p>

      {/* Key Quote */}
      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontSize: '1.1rem',
        fontStyle: 'italic',
        color: '#fff',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>„Steve sagte mir einmal: 'Kevin, erfolgreiche Menschen sagen nicht nur Nein zu schlechten Gelegenheiten. Sie sagen Nein zu guten Gelegenheiten, damit sie Ja zu den großartigen sagen können.'"</>
        ) : (
          <>"Steve once told me: 'Kevin, successful people don't just say no to bad opportunities. They say no to good opportunities so they can say yes to great ones.'"</>
        )}
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das war mein Aha-Moment. Ich brauchte kein weiteres Produktivitätstool – ich brauchte eine völlig andere Denkweise. Anstatt alle Aufgaben zu verwalten, musste ich lernen, zwischen Signal und Noise zu unterscheiden.</>
        ) : (
          <>That was my aha moment. I didn't need another productivity tool—I needed a completely different mindset. Instead of managing all tasks, I needed to learn to distinguish between Signal and Noise.</>
        )}
      </p>

      {/* The 90-Day Experiment */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Das 90-Tage Experiment' : 'The 90-Day Experiment'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Ich startete mein eigenes Signal vs Noise Experiment. Die Regeln waren brutal einfach: Jede Aufgabe wurde entweder als "Signal" (wichtig, wertvoll) oder "Noise" (Ablenkung, unwichtig) klassifiziert. Kein Mittelboden. Keine "irgendwie wichtig" Kategorie. Nur binäre Entscheidungen.</>
        ) : (
          <>I started my own Signal vs Noise experiment. The rules were brutally simple: every task was classified as either "Signal" (important, valuable) or "Noise" (distraction, unimportant). No middle ground. No "somewhat important" category. Just binary decisions.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die ersten Tage waren schockierend. Ich stellte fest, dass 87% meiner täglichen Aktivitäten reines Noise waren. E-Mails über E-Mails über Meetings über andere Meetings. Slack-Nachrichten, die in einer endlosen Schleife von "schnell besprochen" endeten. Tasks, die nur andere Tasks generierten.</>
        ) : (
          <>The first days were shocking. I discovered that 87% of my daily activities were pure Noise. Emails about emails about meetings about other meetings. Slack messages that ended in endless loops of "let's quickly discuss this." Tasks that only generated more tasks.</>
        )}
      </p>

      {/* The Turning Point */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Der Wendepunkt: Tag 47' : 'The Turning Point: Day 47'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Tag 47 veränderte alles. Ich erreichte zum ersten Mal 80% Signal-Ratio. Es war der Tag, an dem ich eine entscheidende Produktentscheidung traf, die unser Unternehmen um 40% wachsen ließ, während ich gleichzeitig 23 "dringende" E-Mails ignorierte. Die E-Mails stellten sich als völlig irrelevant heraus. Die Produktentscheidung generierte €180.000 zusätzlichen Umsatz.</>
        ) : (
          <>Day 47 changed everything. I hit 80% Signal ratio for the first time. It was the day I made a crucial product decision that grew our company by 40%, while simultaneously ignoring 23 "urgent" emails. The emails turned out to be completely irrelevant. The product decision generated €180,000 in additional revenue.</>
        )}
      </p>

      {/* Data Patterns */}
      <div style={{
        backgroundColor: '#111',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '2rem 0',
        border: '1px solid #222'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '300',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Schlüssel-Erkenntnisse aus 90 Tagen Tracking:' : 'Key Insights from 90 Days of Tracking:'}
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          <li style={{
            fontSize: '0.95rem',
            color: '#ccc',
            marginBottom: '0.8rem',
            paddingLeft: '1rem',
            position: 'relative'
          }}>
            <span style={{ position: 'absolute', left: 0, color: '#00ff88' }}>•</span>
            {isGerman ? 'Durchschnittliche Signal-Ratio stieg von 23% auf 81%' : 'Average Signal ratio increased from 23% to 81%'}
          </li>
          <li style={{
            fontSize: '0.95rem',
            color: '#ccc',
            marginBottom: '0.8rem',
            paddingLeft: '1rem',
            position: 'relative'
          }}>
            <span style={{ position: 'absolute', left: 0, color: '#00ff88' }}>•</span>
            {isGerman ? 'Arbeitszeit reduziert von 74 auf 52 Stunden/Woche' : 'Working hours reduced from 74 to 52 hours per week'}
          </li>
          <li style={{
            fontSize: '0.95rem',
            color: '#ccc',
            marginBottom: '0.8rem',
            paddingLeft: '1rem',
            position: 'relative'
          }}>
            <span style={{ position: 'absolute', left: 0, color: '#00ff88' }}>•</span>
            {isGerman ? 'Umsatz stieg um 340% durch fokussierte Produktentscheidungen' : 'Revenue increased 340% through focused product decisions'}
          </li>
          <li style={{
            fontSize: '0.95rem',
            color: '#ccc',
            marginBottom: '0',
            paddingLeft: '1rem',
            position: 'relative'
          }}>
            <span style={{ position: 'absolute', left: 0, color: '#00ff88' }}>•</span>
            {isGerman ? 'Stress-Level sank von 8/10 auf 3/10' : 'Stress level dropped from 8/10 to 3/10'}
          </li>
        </ul>
      </div>

      {/* Building the App */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Von der Erkenntnis zur App' : 'From Insight to App'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Nach 90 Tagen wurde mir klar: Das musste eine App werden. Nicht für mich – für die Millionen von Menschen, die in derselben Produktivitätsfalle gefangen waren wie ich. Aber es durfte nicht nur eine weitere To-Do-App werden. Es musste das fundamentale Problem lösen: die Unfähigkeit, zwischen wichtig und unwichtig zu unterscheiden.</>
        ) : (
          <>After 90 days, it became clear: this had to become an app. Not for me—for the millions of people trapped in the same productivity trap I was. But it couldn't be just another todo app. It had to solve the fundamental problem: the inability to distinguish between important and unimportant.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die Designphilosophie war radikal einfach: Zwei Buttons. Signal oder Noise. Keine Kategorien, keine Prioritätsstufen, keine komplexen Workflows. Nur die binäre Entscheidung, die Steve Jobs großartig machte. Jede Aufgabe würde in Echtzeit das Signal-zu-Noise-Verhältnis beeinflussen, was dem Nutzer sofortiges Feedback über seine Produktivität gab.</>
        ) : (
          <>The design philosophy was radically simple: Two buttons. Signal or Noise. No categories, no priority levels, no complex workflows. Just the binary decision that made Steve Jobs great. Every task would affect the Signal-to-Noise ratio in real-time, giving users immediate feedback on their productivity.</>
        )}
      </p>

      {/* Technical Challenges */}
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2.5rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Die technischen Herausforderungen' : 'The Technical Challenges'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Das größte Problem war nicht die Technologie – es war das Paradoxon der Einfachheit. Wie baut man eine App, die so einfach ist, dass sie keine Lernkurve hat, aber gleichzeitig mächtig genug, um das Verhalten fundamental zu ändern? Die Antwort lag in den Details: ausgeklügeltes Pattern Recognition im Hintergrund, während die Oberfläche brutal simpel blieb.</>
        ) : (
          <>The biggest challenge wasn't technology—it was the paradox of simplicity. How do you build an app that's so simple it requires no learning curve, yet powerful enough to fundamentally change behavior? The answer lay in the details: sophisticated pattern recognition in the background, while keeping the interface brutally simple.</>
        )}
      </p>

      {/* User Feedback Journey */}
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '2.5rem',
        marginBottom: '1rem'
      }}>
        {isGerman ? 'Die ersten Nutzer' : 'The First Users'}
      </h3>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die ersten 100 Nutzer bestätigten meine Theorie: Menschen kämpfen nicht mit der Technologie – sie kämpfen mit Entscheidungen. Eine Nutzerin schrieb: "Ich dachte, ich bräuchte mehr Features. Aber was ich wirklich brauchte, war Klarheit über das, was wichtig ist." Ein anderer Nutzer berichtete von einer 60%igen Steigerung seiner Produktivität in nur 3 Wochen.</>
        ) : (
          <>The first 100 users confirmed my theory: people don't struggle with technology—they struggle with decisions. One user wrote: "I thought I needed more features. What I really needed was clarity about what matters." Another user reported a 60% increase in productivity in just 3 weeks.</>
        )}
      </p>

      {/* The Philosophy */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Mehr als nur eine App' : 'More Than Just an App'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Signal/Noise wurde zu mehr als nur einer Produktivitäts-App. Es wurde zu einer Philosophie. Eine Art, über Prioritäten zu denken, die Claude Shannon in der Informationstheorie begründete und Steve Jobs in der Produktentwicklung perfektionierte. Die App ist nur das Werkzeug – die wahre Kraft liegt in der mentalen Klarheit, die binäres Denken schafft.</>
        ) : (
          <>Signal/Noise became more than just a productivity app. It became a philosophy. A way of thinking about priorities that Claude Shannon established in information theory and Steve Jobs perfected in product development. The app is just the tool—the real power lies in the mental clarity that binary thinking creates.</>
        )}
      </p>

      {/* Lessons Learned */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Was ich gelernt habe' : 'What I Learned'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die größte Lektion: Produktivität ist kein Technologie-Problem, sondern ein Entscheidungs-Problem. Die meisten Menschen wissen intuitiv, was wichtig ist. Was sie brauchen, ist ein System, das ihnen hilft, bei diesen Entscheidungen zu bleiben und ihre Patterns sichtbar zu machen.</>
        ) : (
          <>The biggest lesson: productivity isn't a technology problem, it's a decision problem. Most people intuitively know what's important. What they need is a system that helps them stick to those decisions and makes their patterns visible.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Zweitens: Einfachheit ist schwerer als Komplexität. Es ist einfach, 50 Features hinzuzufügen. Es ist schwer, die 2 Features zu finden, die wirklich zählen. Steve Jobs hatte recht: "Einfachheit ist die ultimative Raffinesse."</>
        ) : (
          <>Second: simplicity is harder than complexity. It's easy to add 50 features. It's hard to find the 2 features that actually matter. Steve Jobs was right: "Simplicity is the ultimate sophistication."</>
        )}
      </p>

      {/* Current Impact */}
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Mission geht weiter' : 'The Mission Continues'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Heute nutzen Tausende von Menschen Signal/Noise, um ihre Produktivitätskrisen zu bewältigen. Die App hat sich zu einem vollständigen System entwickelt: mit Pattern Recognition, Achievement System und AI Coach für Premium-Nutzer. Aber das Kernelement blieb unverändert: zwei einfache Buttons und die Kraft binärer Entscheidungen.</>
        ) : (
          <>Today, thousands of people use Signal/Noise to overcome their productivity crises. The app has evolved into a complete system: with pattern recognition, achievement system, and AI coach for premium users. But the core element remained unchanged: two simple buttons and the power of binary decisions.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ccc',
        marginBottom: '3rem'
      }}>
        {isGerman ? (
          <>Meine persönliche Krise um 3:47 Uhr war der Startpunkt für etwas Größeres: eine Bewegung von Menschen, die verstehen, dass wahre Produktivität nicht darin liegt, mehr zu tun, sondern darin, das Richtige zu tun. Signal/Noise ist mehr als eine App – es ist ein Werkzeug für klarere Entscheidungen in einer chaotischen Welt.</>
        ) : (
          <>My personal 3:47 AM crisis was the starting point for something bigger: a movement of people who understand that true productivity isn't about doing more, but about doing the right things. Signal/Noise is more than an app—it's a tool for clearer decisions in a chaotic world.</>
        )}
      </p>

      {/* CTA Section */}
      <div style={{
        backgroundColor: '#111',
        padding: '2rem',
        borderRadius: '12px',
        margin: '3rem 0',
        border: '2px solid #00ff88',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '300',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Starte dein eigenes Signal vs Noise Experiment' : 'Start Your Own Signal vs Noise Experiment'}
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}>
          {isGerman ? (
            <>Erlebe selbst, wie binäre Entscheidungen deine Produktivität transformieren können. Kostenlos starten, keine Registrierung erforderlich.</>
          ) : (
            <>Experience for yourself how binary decisions can transform your productivity. Start free, no registration required.</>
          )}
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#00ff88',
            color: '#000',
            padding: '0.8rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
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
          {isGerman ? 'Jetzt Signal/Noise ausprobieren' : 'Try Signal/Noise Now'}
        </Link>
      </div>

      {/* Related Articles */}
      <div style={{
        borderTop: '1px solid #333',
        paddingTop: '2rem',
        marginTop: '3rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? 'Verwandte Artikel' : 'Related Articles'}
        </h3>
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          <Link to="/blog/steve-jobs-method" style={{
            color: '#00ff88',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Steve Jobs\' Produktivitätsmethode' : 'Steve Jobs\' Productivity Method'}
          </Link>
          <Link to="/blog/90-day-tracking-experiment" style={{
            color: '#00ff88',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Mein 90-Tage Signal vs Noise Experiment' : 'My 90-Day Signal vs Noise Experiment'}
          </Link>
          <Link to="/blog/signal-vs-noise-philosophy" style={{
            color: '#00ff88',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            → {isGerman ? 'Signal vs Noise: Eine Philosophie für das moderne Leben' : 'Signal vs Noise: A Philosophy for Modern Life'}
          </Link>
        </div>
      </div>
    </>
  );
}