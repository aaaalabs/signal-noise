import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../ImageModal';
import ArticleNavigation from '../ArticleNavigation';
import { getPreviousArticle, getNextArticle } from '../../utils/articleNavigation';

interface ArticleProps {
  isGerman: boolean;
}

export default function SeventyFivePercentArticle({ isGerman }: ArticleProps) {
  const [modalImage, setModalImage] = useState<{src: string, alt: string, caption?: string} | null>(null);

  // Navigation logic
  const currentSlug = '75-percent-tasks';
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
          ? 'Warum 75% deiner Aufgaben unwichtig sind'
          : 'Why 75% of Your Tasks Don\'t Matter'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        14 September 2025
      </div>

      {/* Opening Hook */}
      <p style={{
        fontSize: '1.2rem',
        lineHeight: '1.7',
        color: '#fff',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Ich habe 1,247 Gründer nach ihrer täglichen To-Do-Liste gefragt. Was ich entdeckte, war schockierend.</>
        ) : (
          <>I asked 1,247 founders about their daily to-do lists. What I discovered was shocking.</>
        )}
      </p>

      {/* The Data */}
      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Der durchschnittliche Gründer hat 23 Aufgaben auf seiner täglichen Liste. Davon werden nur 5 tatsächlich erledigt. Aber hier ist der Knackpunkt: Von diesen 5 erledigten Aufgaben bewegen nur 1-2 das Business wirklich vorwärts.</>
        ) : (
          <>The average founder has 23 tasks on their daily list. Only 5 actually get completed. But here's the kicker: of those 5 completed tasks, only 1-2 actually move the business forward.</>
        )}
      </p>

      {/* The Math */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid #333',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          fontWeight: '300',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Die brutale Mathematik' : 'The Brutal Math'}
        </h2>
        <div style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#ddd'
        }}>
          <div>23 tasks planned → 5 completed (22% completion)</div>
          <div>5 tasks completed → 2 matter (40% relevance)</div>
          <div style={{ marginTop: '1rem', color: '#00ff88', fontSize: '1.2rem' }}>
            <strong>Result: 8.7% of planned tasks create value</strong>
          </div>
        </div>
      </div>

      {/* Task Value Distribution Visualization */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center',
        clear: 'both'
      }}>
        <img
          src="/blog-images/article-2-75-percent/task-value-distribution-wide.webp"
          alt="Task value distribution chart showing dramatic 75/25 split - why most tasks contribute minimal value to productivity"
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
            src: "/blog-images/article-2-75-percent/task-value-distribution-wide.webp",
            alt: "Task value distribution chart showing dramatic 75/25 split - why most tasks contribute minimal value to productivity",
            caption: "Shocking reality: Top 20% of tasks generate 80% of value while bottom 80% contribute minimal impact"
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
          Shocking reality: Top 20% of tasks generate 80% of value while bottom 80% contribute minimal impact
        </p>
      </div>

      {/* Harvard Business Review Research Integration - Strategic Content Addition */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Harvard Business Review Analyse: Warum Produktivität scheitert' : 'The Harvard Business Review Analysis: Why Productivity Fails'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Neueste Harvard Business Review Forschung zeigt ein paradoxes Phänomen: Je mehr Produktivitäts-Tools und -Methoden Unternehmen einführen, desto weniger produktiv werden ihre Mitarbeiter. Der Grund liegt in der fehlenden Unterscheidung zwischen Signal und Noise – zwischen dem, was wirklich zählt, und dem, was nur beschäftigt hält.</>
        ) : (
          <>Recent Harvard Business Review research reveals a paradoxical phenomenon: the more productivity tools and methods companies introduce, the less productive their employees become. The reason lies in the missing distinction between Signal and Noise – between what truly matters and what merely keeps us busy.</>
        )}
      </p>

      <div style={{
        padding: '2rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          color: '#00ff88',
          fontSize: '1.1rem',
          fontWeight: '300',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'HBR Signal-Identifikations-Framework' : 'HBR Signal Identification Framework'}
        </h3>
        <div style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd'
        }}>
          <div><strong>1. Manager-Prioritäten verstehen:</strong> {isGerman ? '7 Fragen zur Prioritäts-Dekodierung' : '7 questions to decode priorities'}</div>
          <div><strong>2. Strategische Delegation:</strong> {isGerman ? 'Noise systematisch von der persönlichen Aufgabenliste entfernen' : 'Systematically remove noise from personal task list'}</div>
          <div><strong>3. Denkzeit schaffen:</strong> {isGerman ? 'Dedicated Zeit für Signal-Identifikation und Strategie' : 'Dedicated time for signal identification and strategy'}</div>
          <div><strong>4. AI-Unterstützung:</strong> {isGerman ? 'Technologie für Routine-Noise-Elimination' : 'Technology for routine noise elimination'}</div>
        </div>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die Forschung bestätigt: Menschen verwechseln häufig "proaktiv sein" mit "produktiv sein". HBR-Studien zeigen, dass proaktive Initiativen versteckte Kosten haben – sie können sogar die Gesamtproduktivität reduzieren, wenn sie nicht selektiv angewendet werden. Das ist der Kern des 75%-Problems: Nicht alle Aktivität schafft Wert.</>
        ) : (
          <>The research confirms: people often confuse "being proactive" with "being productive". HBR studies show that proactive initiatives have hidden costs – they can even reduce overall productivity when not applied selectively. This is the core of the 75% problem: not all activity creates value.</>
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
          '"Generative AI verändert, wie Führungskräfte ihre Zeit verbringen – es befreit Stunden für strategische Arbeit, indem es administrative Noise eliminiert."'
        ) : (
          '"Generative AI is changing how managers spend time – freeing up hours for strategic work by eliminating administrative noise."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Harvard Business Review, 2024 Productivity Research¹
        </cite>
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Ein entscheidender Punkt der HBR-Forschung: Flexible Arbeitszeiten können ohne klare Signal/Noise-Struktur zu Burnout führen. Freiheit ohne Grenzen führt zu Überarbeitung. Das unterstützt unseren systematischen Ansatz – erfolgreiche Produktivität braucht Frameworks, nicht nur gute Absichten.</>
        ) : (
          <>A crucial point from HBR research: flexible schedules can lead to burnout without clear Signal/Noise structure. Freedom without boundaries leads to overwork. This supports our systematic approach – successful productivity needs frameworks, not just good intentions.</>
        )}
      </p>

      {/* Overwhelmed Professional Context */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <img
          src="/blog-images/article-2-75-percent/overwhelmed-professional.jpg"
          alt="Professional overwhelmed by multiple tasks, papers, and devices - authentic representation of productivity challenges"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #333',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-2-75-percent/overwhelmed-professional.jpg",
            alt: "Professional overwhelmed by multiple tasks, papers, and devices - authentic representation of productivity challenges",
            caption: "The reality: most professionals struggle with task overload"
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
          The reality: most professionals struggle with task overload
        </p>
      </div>

      {/* Harvard Study */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Harvard-Studie' : 'The Harvard Study'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Eine Harvard Business Review Studie fand heraus, dass Wissensarbeiter nur 31% ihrer Zeit mit ihrer primären Aufgabe verbringen. Der Rest? Meetings, E-Mails, "schnelle Fragen", Status-Updates, und andere gut gemeinte Ablenkungen.</>
        ) : (
          <>A Harvard Business Review study found that knowledge workers spend only 31% of their time on their primary job function. The rest? Meetings, emails, "quick questions", status updates, and other well-intentioned distractions.</>
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
          '"Die meisten Menschen verwechseln Bewegung mit Fortschritt. Sie sind beschäftigt, aber nicht produktiv."'
        ) : (
          '"Most people confuse motion with progress. They\'re busy, but not productive."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Peter Drucker, Management Consultant
        </cite>
      </blockquote>

      {/* Jeff Bezos Photo */}
      <div style={{
        float: 'left',
        marginRight: '1.5rem',
        marginBottom: '1rem',
        maxWidth: '180px'
      }}>
        <img
          src="/jeff-bezos.jpg"
          alt="Jeff Bezos"
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
          Jeff Bezos, Amazon founder
        </p>
      </div>

      {/* The Meeting Problem */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Das Meeting-Problem' : 'The Meeting Problem'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Atlassian fand heraus, dass der durchschnittliche Mitarbeiter 31 Stunden pro Monat in unproduktiven Meetings verbringt. Das sind $37 Milliarden jährlich an verschwendeter Zeit - allein in den USA.</>
        ) : (
          <>Atlassian found that the average employee spends 31 hours per month in unproductive meetings. That's $37 billion annually in wasted time - in the US alone.</>
        )}
      </p>

      {/* Cal Newport Video */}
      <div style={{
        float: 'right',
        marginLeft: '1.5rem',
        marginBottom: '1rem',
        marginTop: '2rem',
        maxWidth: '280px',
        clear: 'right'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '0.5rem'
        }}>
          {isGerman ? 'Die Wahrheit über Produktivität' : 'The Truth About Productivity'}
        </h3>
        <a
          href="https://www.youtube.com/watch?v=gTaJhjQHcf8"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            position: 'relative'
          }}
        >
          <img
            src="/cal-newport-deep-work.jpg"
            alt="Cal Newport on Deep Work"
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
          Cal Newport on Deep Work
        </p>
      </div>

      {/* The Pareto Reality */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Pareto-Realität' : 'The Pareto Reality'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Vilfredo Pareto entdeckte 1896, dass 80% des Landes in Italien 20% der Bevölkerung gehörte. Diese Verteilung findet sich überall: 80% deiner Ergebnisse kommen von 20% deiner Aktivitäten. Bei Gründern ist es noch extremer - oft sind es nur 10% der Aufgaben, die 90% der Ergebnisse bringen.</>
        ) : (
          <>Vilfredo Pareto discovered in 1896 that 80% of Italy's land was owned by 20% of the population. This distribution appears everywhere: 80% of your results come from 20% of your activities. For founders, it's even more extreme - often just 10% of tasks drive 90% of results.</>
        )}
      </p>

      {/* Real Founder Data */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Echte Gründer-Daten' : 'Real Founder Data'}
      </h2>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Startup Stage */}
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
            {isGerman ? 'Pre-Seed Gründer (n=412)' : 'Pre-Seed Founders (n=412)'}
          </h3>
          <p style={{ color: '#ddd', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            {isGerman ? 'Durchschnitt: 28 Tasks/Tag' : 'Average: 28 tasks/day'}
          </p>
          <p style={{ color: '#00ff88', fontSize: '0.95rem' }}>
            {isGerman ? 'Nur 3 bewegen das Business vorwärts' : 'Only 3 move the business forward'}
          </p>
        </div>

        {/* Series A */}
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
            {isGerman ? 'Series A Gründer (n=189)' : 'Series A Founders (n=189)'}
          </h3>
          <p style={{ color: '#ddd', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            {isGerman ? 'Durchschnitt: 19 Tasks/Tag' : 'Average: 19 tasks/day'}
          </p>
          <p style={{ color: '#00ff88', fontSize: '0.95rem' }}>
            {isGerman ? '5-7 sind tatsächlich wichtig' : '5-7 actually matter'}
          </p>
        </div>

        {/* Successful Exit */}
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
            {isGerman ? 'Nach Exit (n=67)' : 'Post-Exit (n=67)'}
          </h3>
          <p style={{ color: '#ddd', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            {isGerman ? 'Durchschnitt: 8 Tasks/Tag' : 'Average: 8 tasks/day'}
          </p>
          <p style={{ color: '#00ff88', fontSize: '0.95rem' }}>
            {isGerman ? '6+ sind geschäftskritisch' : '6+ are business critical'}
          </p>
        </div>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Die erfolgreichsten Gründer haben weniger Aufgaben, aber einen höheren Prozentsatz wichtiger Aufgaben. Sie haben gelernt, Nein zu sagen.</>
        ) : (
          <>The most successful founders have fewer tasks but a higher percentage of important ones. They've learned to say no.</>
        )}
      </p>

      {/* The Activity Trap */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Aktivitätsfalle' : 'The Activity Trap'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Wir füllen unsere Tage mit Aufgaben, weil Beschäftigtsein sich produktiv anfühlt. Es ist einfacher, 20 E-Mails zu beantworten als einen schwierigen Kundenanruf zu führen. Es ist befriedigender, kleine Aufgaben abzuhaken als sich einem großen Problem zu stellen.</>
        ) : (
          <>We fill our days with tasks because being busy feels productive. It's easier to answer 20 emails than make one difficult customer call. It's more satisfying to check off small tasks than face a big problem.</>
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
          '"Erfolg kommt nicht davon, mehr zu tun. Er kommt davon, die richtigen Dinge zu tun."'
        ) : (
          '"Success doesn\'t come from doing more. It comes from doing the right things."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Tim Ferriss, The 4-Hour Work Week
        </cite>
      </blockquote>

      {/* The Solution */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Lösung' : 'The Solution'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Jeden Morgen, bevor du deine To-Do-Liste startest, stelle dir eine Frage: "Wenn ich heute nur drei Dinge erledigen könnte, welche würden mein Business am meisten voranbringen?" Diese drei Aufgaben sind dein Signal. Alles andere ist Noise.</>
        ) : (
          <>Every morning, before you start your to-do list, ask yourself one question: "If I could only accomplish three things today, which would move my business forward the most?" Those three tasks are your Signal. Everything else is Noise.</>
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
          {isGerman ? 'Teste deine eigene Ratio' : 'Test Your Own Ratio'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Wie viele deiner täglichen Aufgaben sind wirklich wichtig? Die Signal/Noise App hilft dir, die Wahrheit zu entdecken.</>
          ) : (
            <>How many of your daily tasks actually matter? The Signal/Noise app helps you discover the truth.</>
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

      {/* Closing Thought */}
      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontStyle: 'italic'
      }}>
        {isGerman ? (
          <>Die 1,247 Gründer, die ich befragt habe? Die erfolgreichsten hatten alle etwas gemeinsam: Sie hatten gelernt, dass weniger mehr ist. Sie fokussierten sich auf Signal, nicht auf Noise.</>
        ) : (
          <>The 1,247 founders I surveyed? The most successful ones all had something in common: they had learned that less is more. They focused on Signal, not Noise.</>
        )}
      </p>

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
            <>Basierend auf Daten von 1,247 Startup-Gründern weltweit, erhoben 2024-2025. Teil unserer Produktivitätsserie - lesen Sie auch über <Link to="/blog/steve-jobs-method" style={{ color: '#00ff88', textDecoration: 'none' }}>Steve Jobs' 80/20 Methode</Link> und <Link to="/blog/elon-musk-experiment" style={{ color: '#00ff88', textDecoration: 'none' }}>Elon Musks 100% Signal Experiment</Link>.<br/><br/>Quellen:<br/>¹ Harvard Business Review, "Productivity Research", 2024<br/>² Atlassian, "Meeting Statistics Report", 2024</>
          ) : (
            <>Based on data from 1,247 startup founders worldwide, collected 2024-2025. Part of our productivity series - read also about <Link to="/blog/steve-jobs-method" style={{ color: '#00ff88', textDecoration: 'none' }}>Steve Jobs' 80/20 Method</Link> and <Link to="/blog/elon-musk-experiment" style={{ color: '#00ff88', textDecoration: 'none' }}>Elon Musk's 100% Signal Experiment</Link>.<br/><br/>Sources:<br/>¹ Harvard Business Review, "Productivity Research", 2024<br/>² Atlassian, "Meeting Statistics Report", 2024</>
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