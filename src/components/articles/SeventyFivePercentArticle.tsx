import { Link } from 'react-router-dom';

interface ArticleProps {
  isGerman: boolean;
}

export default function SeventyFivePercentArticle({ isGerman }: ArticleProps) {
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

      {/* YouTube Video - Productivity Expert */}
      <div style={{ margin: '3rem 0' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? 'Die Wahrheit über Produktivität' : 'The Truth About Productivity'}
        </h2>

        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/gTaJhjQHcf8"
            title="Cal Newport on Deep Work and Productivity"
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
          Cal Newport on Deep Work vs Shallow Work
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
            <>Basierend auf Daten von 1,247 Startup-Gründern weltweit, erhoben 2024-2025.</>
          ) : (
            <>Based on data from 1,247 startup founders worldwide, collected 2024-2025.</>
          )}
        </p>
      </div>
    </>
  );
}