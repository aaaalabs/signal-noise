import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../ImageModal';
import ArticleNavigation from '../ArticleNavigation';
import { getPreviousArticle, getNextArticle } from '../../utils/articleNavigation';

interface ArticleProps {
  isGerman: boolean;
}

export default function FoundersParadoxArticle({ isGerman }: ArticleProps) {
  const [modalImage, setModalImage] = useState<{src: string, alt: string, caption?: string} | null>(null);

  // Navigation logic
  const currentSlug = 'founder-productivity-paradox';
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
          ? 'Das Gründer-Paradoxon: Warum Freiheit den Fokus zerstört'
          : 'The Founder\'s Paradox: Why Freedom Kills Focus (And How to Fight Back)'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        1 October 2024
      </div>

      {/* Opening Hook */}
      <p style={{
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem',
        fontWeight: '300'
      }}>
        {isGerman ? (
          <>Der Tag, an dem du als Unternehmer wahrhaft frei wirst, ist der Tag, an dem das Fokussieren exponentiell schwerer wird. Das ist das Gründer-Paradoxon - und es ruiniert mehr Unternehmen als schlechte Produkte oder fehlende Finanzierung.</>
        ) : (
          <>The day you become truly free as an entrepreneur is the day when focusing becomes exponentially harder. This is the founder's paradox - and it ruins more companies than bad products or lack of funding.</>
        )}
      </p>

      {/* Opening Quote */}
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
          '"Das Paradoxon ist, dass unbegrenzte Optionen nicht unbegrenzte Möglichkeiten schaffen - sie schaffen unbegrenzte Paralyse."'
        ) : (
          '"The paradox is that unlimited options don\'t create unlimited possibilities - they create unlimited paralysis."'
        )}
      </blockquote>

      {/* The Paradox Revealed */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Das Paradoxon enthüllt' : 'The Paradox Revealed'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Sarah hatte endlich geschafft, wovon sie jahrelang geträumt hatte. Nach acht Jahren im Corporate-Hamsterrad kündigte sie ihren Job als Product Manager und startete ihr eigenes Unternehmen. Komplette Freiheit. Keine Meetings mehr, die nichts bringen. Keine sinnlosen Reports. Keine Mikromanager.</>
        ) : (
          <>Sarah had finally achieved what she'd dreamed of for years. After eight years in the corporate hamster wheel, she quit her job as a Product Manager and started her own company. Complete freedom. No more pointless meetings. No meaningless reports. No micromanagers.</>
        )}
      </p>

      {/* Video 1: Founder Productivity Challenges */}
      <div style={{ margin: '3rem 0' }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Die Realität der Gründer-Produktivität' : 'The Reality of Founder Productivity'}
        </h3>

        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/YEgm2jxuoEs"
            title="Founder Productivity Challenges"
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
          Understanding the unique productivity challenges founders face
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Sechs Monate später saß Sarah in ihrem Home Office und starrte auf eine Aufgabenliste mit 47 Punkten. Alles war "wichtig". Produktentwicklung, Marketing, Buchhaltung, Kundenservice, Networking, Content Creation, Partnerships, Analytics... Die Freiheit, alles tun zu können, hatte sich in die Unmöglichkeit verwandelt, irgendetwas richtig zu tun.</>
        ) : (
          <>Six months later, Sarah sat in her home office staring at a task list with 47 items. Everything was "important". Product development, marketing, accounting, customer service, networking, content creation, partnerships, analytics... The freedom to do anything had become the impossibility of doing anything well.</>
        )}
      </p>

      {/* Shocking Statistics */}
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 0, 0, 0.05)',
          border: '1px solid rgba(255, 0, 0, 0.2)'
        }}>
          <h3 style={{
            color: '#ff4444',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Schockierende Statistiken' : 'Shocking Statistics'}
          </h3>
          <ul style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {isGerman ? (
              <>
                <li>• Gründer treffen 35.000 Entscheidungen täglich (vs. 3.000 bei Angestellten)</li>
                <li>• 73% der Startup-Gründer fühlen sich von der Anzahl verfügbarer Optionen überwältigt</li>
                <li>• 89% gescheiterter Startups nennen "mangelnden Fokus" als Hauptgrund</li>
                <li>• Produktivität sinkt um 40% bei mehr als 10 Optionen</li>
              </>
            ) : (
              <>
                <li>• Founders make 35,000 decisions daily (vs. 3,000 for employees)</li>
                <li>• 73% of startup founders feel overwhelmed by available options</li>
                <li>• 89% of failed startups cite "lack of focus" as primary reason</li>
                <li>• Productivity decreases 40% with more than 10 options</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* The Science Behind the Paradox */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Wissenschaft hinter dem Paradoxon' : 'The Science Behind the Paradox'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Barry Schwartz' bahnbrechende Forschung zum{' '}
          <a
            href="https://www.ted.com/talks/barry_schwartz_the_paradox_of_choice"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            "Paradox of Choice"
          </a>{' '}erklärt, warum Sarah - und Millionen von Gründern wie sie - in der Falle sitzen. Unser Gehirn wurde für eine Welt mit begrenzten Optionen entwickelt. Wenn wir mit unbegrenzten Möglichkeiten konfrontiert werden, überlastet unser kognitives System.</>
        ) : (
          <><a
            href="https://www.ted.com/talks/barry_schwartz_the_paradox_of_choice"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Barry Schwartz's
          </a>{' '}groundbreaking research on the{' '}
          <a
            href="https://www.amazon.com/Paradox-Choice-Why-More-Less/dp/0060005696"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            "Paradox of Choice"
          </a>{' '}explains why Sarah - and millions of founders like her - are trapped. Our brains evolved for a world of limited options. When confronted with unlimited possibilities, our cognitive system overloads.</>
        )}
      </p>

      {/* Video 2: Business Focus Strategy */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '300px',
        minWidth: '280px'
      }}>
        <div style={{
          position: 'relative',
          paddingBottom: '177.78%', // 9:16 aspect ratio for YouTube Shorts
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/ggkOqyDbpN8"
            title="Business Focus Strategy"
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
          fontSize: '0.75rem',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          Quick focus strategy for entrepreneurs
        </p>
      </div>

      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1rem',
        lineHeight: '1.7'
      }}>
        {isGerman
          ? '"Wahlüberladung tritt auf, wenn die Vorteile von Vielfalt und Wahlfreiheit durch die Komplexität des Wahlprozesses selbst aufgehoben werden."'
          : '"Choice overload occurs when the advantages of diversity and freedom of choice are canceled by the complexity of the choice process itself."'}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Barry Schwartz, The Paradox of Choice
        </cite>
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die{' '}
          <a
            href="https://faculty.washington.edu/jdb/345/345%20Articles/Iyengar%20&%20Lepper%20(2000).pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Columbia University Studie
          </a>{' '}bestätigte dies dramatisch: Menschen, die zwischen 24 Marmeladesorten wählen konnten, kauften 10x seltener als Menschen mit nur 6 Optionen. Bei Gründern ist der Effekt noch extremer - sie wechseln durchschnittlich alle 11 Minuten die Aufgabe, verglichen mit 23 Minuten bei Angestellten.</>
        ) : (
          <><a
            href="https://faculty.washington.edu/jdb/345/345%20Articles/Iyengar%20&%20Lepper%20(2000).pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Columbia University's study
          </a>{' '}confirmed this dramatically: people choosing between 24 jam varieties were 10x less likely to buy than those with only 6 options. For founders, the effect is even more extreme - they switch tasks every 11 minutes on average, compared to 23 minutes for employees.</>
        )}
      </p>

      {/* The Entrepreneur's Unique Challenge */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die einzigartige Herausforderung des Unternehmers' : 'The Entrepreneur\'s Unique Challenge'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Als Angestellte hatten wir Struktur. Jemand anderes entschied, was wichtig war. Job Descriptions, Quarterly Reviews, klar definierte KPIs. Diese Strukturen fühlten sich einschränkend an - bis wir plötzlich ohne sie waren.</>
        ) : (
          <>As employees, we had structure. Someone else decided what was important. Job descriptions, quarterly reviews, clearly defined KPIs. These structures felt constraining - until we suddenly found ourselves without them.</>
        )}
      </p>

      {/* Video 3: Decision Making Strategy */}
      <div style={{
        float: 'left',
        marginRight: '2rem',
        marginBottom: '1rem',
        maxWidth: '300px',
        minWidth: '280px'
      }}>
        <div style={{
          position: 'relative',
          paddingBottom: '177.78%', // 9:16 aspect ratio for YouTube Shorts
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/Fy9nTbZAoWw"
            title="Decision Making Strategy"
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
          fontSize: '0.75rem',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          Strategic decision-making for founders
        </p>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <><a
            href="https://www.reidhoffman.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Reid Hoffman
          </a>{' '}fasst es perfekt zusammen: "Jede Entscheidung trägt Opportunitätskosten. Unternehmer stehen täglich Tausenden dieser Kosten gegenüber." Während ein Product Manager zwischen 3-5 vordefinierten Optionen wählt, steht ein Gründer vor praktisch unbegrenzten Möglichkeiten.</>
        ) : (
          <><a
            href="https://www.reidhoffman.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Reid Hoffman
          </a>{' '}captures it perfectly: "Every decision carries an opportunity cost. Entrepreneurs face thousands of these costs daily." While a Product Manager chooses between 3-5 predefined options, a founder faces virtually unlimited possibilities.</>
        )}
      </p>

      <div style={{ clear: 'both', marginBottom: '2rem' }}></div>

      {/* Corporate vs Entrepreneur Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Corporate Structure */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#ccc',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Corporate-Struktur' : 'Corporate Structure'}
          </h3>
          <ul style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {isGerman ? (
              <>
                <li>• Vordefinierte Prioritäten</li>
                <li>• Klare Verantwortlichkeiten</li>
                <li>• Begrenzte Entscheidungsfreiheit</li>
                <li>• Externe Struktur und Kontrolle</li>
                <li>• 3.000 Entscheidungen täglich</li>
              </>
            ) : (
              <>
                <li>• Predefined priorities</li>
                <li>• Clear responsibilities</li>
                <li>• Limited decision freedom</li>
                <li>• External structure and control</li>
                <li>• 3,000 decisions daily</li>
              </>
            )}
          </ul>
        </div>

        {/* Entrepreneurial Freedom */}
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
            {isGerman ? 'Unternehmerische Freiheit' : 'Entrepreneurial Freedom'}
          </h3>
          <ul style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {isGerman ? (
              <>
                <li>• Unbegrenzte Optionen</li>
                <li>• Vollständige Verantwortung</li>
                <li>• Infinite Entscheidungsfreiheit</li>
                <li>• Selbstorganisation erforderlich</li>
                <li>• 35.000 Entscheidungen täglich</li>
              </>
            ) : (
              <>
                <li>• Unlimited options</li>
                <li>• Complete responsibility</li>
                <li>• Infinite decision freedom</li>
                <li>• Self-organization required</li>
                <li>• 35,000 decisions daily</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* The Hidden Costs of Freedom */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die versteckten Kosten der Freiheit' : 'The Hidden Costs of Freedom'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Was niemand über unternehmerische Befreiung erzählt: 52% der Unternehmer arbeiten mehr als 60 Stunden pro Woche, fühlen sich aber weniger produktiv als zu Angestelltenzeiten. Sie haben die Freiheit, alles zu tun - und genau das wird zum Problem.</>
        ) : (
          <>What nobody tells you about entrepreneurial liberation: 52% of entrepreneurs work more than 60 hours per week but feel less productive than when they were employees. They have the freedom to do anything - and that's exactly what becomes the problem.</>
        )}
      </p>

      {/* Video 4: Entrepreneurial Focus Methods */}
      <div style={{ margin: '3rem 0' }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Bewährte Fokus-Methoden für Gründer' : 'Proven Focus Methods for Founders'}
        </h3>

        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/W-OfQnENVaI"
            title="Entrepreneurial Focus Methods"
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
          Specific methods for maintaining entrepreneurial focus and avoiding choice paralysis
        </p>
      </div>

      <blockquote style={{
        borderLeft: '3px solid #00ff88',
        paddingLeft: '1.5rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        color: '#ddd',
        fontSize: '1rem',
        lineHeight: '1.7'
      }}>
        {isGerman
          ? '"Der Feind der Umsetzung ist die Optionalität. Je mehr Wahlmöglichkeiten du hast, desto unwahrscheinlicher ist es, dass du überhaupt wählst."'
          : '"The enemy of execution is optionality. The more choices you have, the less likely you are to choose at all."'}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          —{' '}
          <a
            href="https://tim.blog/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Tim Ferriss
          </a>
          ,{' '}
          <a
            href="https://www.amazon.com/4-Hour-Workweek-Escape-Live-Anywhere/dp/0307465357"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            4-Hour Work Week
          </a>
        </cite>
      </blockquote>

      {/* The Signal vs Noise Solution */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Signal vs Noise Lösung' : 'The Signal vs Noise Solution'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Hier kommt das 80/20-Prinzip ins Spiel - aber nicht wie du es kennst.{' '}
          <a
            href="https://calnewport.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Cal Newport
          </a>{' '}erklärt es perfekt: "Struktur ist nicht der Feind der Kreativität; sie ist das Fundament, das es der Kreativität ermöglicht zu blühen." Das Signal/Noise-Framework löst das Gründer-Paradoxon, indem es künstliche, aber befreiende Beschränkungen schafft.</>
        ) : (
          <>Here's where the 80/20 principle comes in - but not as you know it.{' '}
          <a
            href="https://calnewport.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Cal Newport
          </a>{' '}explains it perfectly: "Structure is not the enemy of creativity; it's the foundation that allows creativity to flourish." The Signal/Noise framework solves the founder's paradox by creating artificial but liberating constraints.</>
        )}
      </p>

      {/* Video 5: Business Strategy and Focus */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '350px'
      }}>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/CqUx-GjMnUg"
            title="Business Strategy and Focus"
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
          fontSize: '0.75rem',
          marginTop: '0.5rem',
          textAlign: 'center'
        }}>
          Strategic framework for focus
        </p>
      </div>

      {/* The Framework */}
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Signal */}
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
            {isGerman ? '80% Signal - Die 3-5 kritischen Aufgaben' : '80% Signal - The 3-5 Critical Tasks'}
          </h3>
          <ul style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {isGerman ? (
              <>
                <li>• Aufgaben, die das Unternehmen in den nächsten 18 Stunden voranbringen</li>
                <li>• Direkt messbare Auswirkungen auf Umsatz oder Produkt</li>
                <li>• Können nicht delegiert werden (nur du kannst sie machen)</li>
                <li>• Bewegen die Nadel in Richtung deiner Vision</li>
                <li>• Erschaffen langfristigen Wert</li>
              </>
            ) : (
              <>
                <li>• Tasks that move the company forward in the next 18 hours</li>
                <li>• Directly measurable impact on revenue or product</li>
                <li>• Cannot be delegated (only you can do them)</li>
                <li>• Move the needle toward your vision</li>
                <li>• Create long-term value</li>
              </>
            )}
          </ul>
        </div>

        {/* Noise */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#ccc',
            fontSize: '1.1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? '20% Noise - Alles andere' : '20% Noise - Everything Else'}
          </h3>
          <ul style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {isGerman ? (
              <>
                <li>• E-Mails und administrative Aufgaben</li>
                <li>• Networking-Veranstaltungen ohne klaren Nutzen</li>
                <li>• "Wichtige" Meetings ohne konkrete Ergebnisse</li>
                <li>• Social Media und Inhaltserstellung</li>
                <li>• Perfektionierung bereits funktionierender Systeme</li>
              </>
            ) : (
              <>
                <li>• Emails and administrative tasks</li>
                <li>• Networking events without clear ROI</li>
                <li>• "Important" meetings without concrete outcomes</li>
                <li>• Social media and content creation</li>
                <li>• Perfecting already-working systems</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div style={{ clear: 'both', marginBottom: '2rem' }}></div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <><a
            href="https://paulgraham.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Paul Graham
          </a>{' '}von Y Combinator bringt es auf den Punkt: "Erfolgreiche Unternehmer haben nicht mehr Optionen - sie haben bessere Filter." Das Signal/Noise-Framework ist genau das: ein Filter, der das Gründer-Paradoxon löst, indem er die kognitiven Kosten unbegrenzter Wahlmöglichkeiten eliminiert.</>
        ) : (
          <><a
            href="https://paulgraham.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Paul Graham
          </a>{' '}from{' '}
          <a
            href="https://www.ycombinator.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00ff88',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            Y Combinator
          </a>{' '}nails it: "Successful entrepreneurs don't have more options - they have better filters." The Signal/Noise framework is exactly that: a filter that solves the founder's paradox by eliminating the cognitive costs of unlimited choice.</>
        )}
      </p>

      {/* Implementation: Your Freedom Recovery Plan */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Dein Freiheits-Wiederherstellungsplan' : 'Your Freedom Recovery Plan'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die gute Nachricht: Das Gründer-Paradoxon ist lösbar. Unternehmer mit strukturierten täglichen Routinen schaffen es 3,2x wahrscheinlicher über 1 Million Euro Umsatz zu skalieren. Die Verwendung des 80/20-Prinzips führt zu 67% Verbesserung der Entscheidungsgeschwindigkeit.</>
        ) : (
          <>The good news: the founder's paradox is solvable. Entrepreneurs with structured daily routines are 3.2x more likely to scale past $1M revenue. Using the 80/20 rule leads to 67% improvement in decision-making speed.</>
        )}
      </p>

      {/* Implementation Steps */}
      <div style={{
        display: 'grid',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Week 1 */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h4 style={{
            color: '#00ff88',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Woche 1: Audit' : 'Week 1: Audit'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.5'
          }}>
            {isGerman
              ? 'Tracke jede Aufgabe für 7 Tage. Keine Änderungen, nur Bewusstsein schaffen. Kategorisiere später: "Hat das mein Unternehmen vorangebracht oder nicht?"'
              : 'Track every task for 7 days. No changes, just create awareness. Categorize later: "Did this move my company forward or not?"'}
          </p>
        </div>

        {/* Week 2 */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h4 style={{
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Woche 2: Filter' : 'Week 2: Filter'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.5'
          }}>
            {isGerman
              ? 'Implementiere den täglichen 3-Aufgaben-Filter. Jeden Morgen: Welche 3 Aufgaben bringen mein Unternehmen heute am meisten voran? Alles andere ist Noise.'
              : 'Implement the daily 3-task filter. Every morning: Which 3 tasks will move my company forward the most today? Everything else is Noise.'}
          </p>
        </div>

        {/* Week 3 */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h4 style={{
            color: '#00ff88',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Woche 3: Struktur' : 'Week 3: Structure'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.5'
          }}>
            {isGerman
              ? 'Baue unterstützende Systeme: Time Blocking für Signal-Aufgaben, E-Mail-Batching, "Nein"-Vorlagen für Ablenkungen. Struktur erschafft Freiheit.'
              : 'Build supporting systems: Time blocking for Signal tasks, email batching, "No" templates for distractions. Structure creates freedom.'}
          </p>
        </div>

        {/* Week 4 */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h4 style={{
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Woche 4: Optimierung' : 'Week 4: Optimization'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.5'
          }}>
            {isGerman
              ? 'Verfeinere das System. Welche Signal-Aufgaben haben den größten Impact? Automatisiere oder eliminiere mehr Noise. Schaffe Nachhaltigkeit.'
              : 'Refine the system. Which Signal tasks have the biggest impact? Automate or eliminate more Noise. Create sustainability.'}
          </p>
        </div>
      </div>

      {/* Signal/Noise App Integration */}
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
          {isGerman ? 'Löse dein Gründer-Paradoxon' : 'Solve Your Founder\'s Paradox'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Die Signal/Noise-App wendet diese Forschungserkenntnisse direkt auf deinen Gründer-Alltag an. Keine komplexen Features, keine Ablenkungen - nur die brutale Klarheit, die du brauchst, um das Paradoxon der Wahlfreiheit zu überwinden. Wie Sarah wieder Fokus fand und ihr Startup skalierte.</>
          ) : (
            <>The Signal/Noise app applies this research directly to your founder life. No complex features, no distractions - just the brutal clarity you need to overcome the paradox of choice. Like Sarah, who found her focus again and scaled her startup.</>
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
            {isGerman ? 'Paradoxon lösen' : 'Solve the Paradox'}
          </Link>
        </div>
      </div>

      {/* The Uncomfortable Truth */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die unbequeme Wahrheit' : 'The Uncomfortable Truth'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die meisten Gründer werden nie zu ihrer vollen Produktivität zurückfinden. Sie werden weiterhin in der Illusion gefangen sein, dass mehr Freiheit mehr Möglichkeiten bedeutet. Sie werden 60+ Stunden arbeiten und sich dabei fragen, warum sie weniger erreichen als früher in ihrem 40-Stunden-Job.</>
        ) : (
          <>Most founders will never return to their full productivity. They'll remain trapped in the illusion that more freedom means more possibilities. They'll work 60+ hours wondering why they achieve less than they did in their 40-hour job.</>
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
        {isGerman
          ? '"Beschränkungen zwingen dich dazu, kreativ zu sein. Ohne sie hast du zu viele Pfade und wählst keinen."'
          : '"Constraints force you to be creative. Without them, you have too many paths and choose none."'}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Phil Hansen, TED Talk
        </cite>
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Aber du musst nicht einer von ihnen sein. Das Signal/Noise-Framework gibt dir die Struktur zurück, die du verloren hast, als du deinen Job gekündigt hast. Es ist die Brücke zwischen der Corporate-Struktur, die du hasst, und der anarchischen Freiheit, die dich lähmt.</>
        ) : (
          <>But you don't have to be one of them. The Signal/Noise framework gives you back the structure you lost when you quit your job. It's the bridge between the corporate structure you hated and the anarchic freedom that paralyzes you.</>
        )}
      </p>

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
          ? '"Die 80/20-Regel geht nicht nur um Ergebnisse - sie geht darum, die kognitive Last unendlicher Wahlmöglichkeiten zu reduzieren."'
          : '"The 80/20 rule isn\'t just about results - it\'s about reducing the cognitive load of infinite choice."'}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Signal/Noise Methodology
        </cite>
      </blockquote>

      {/* Related Articles */}
      <div style={{
        borderTop: '1px solid #222',
        marginTop: '4rem',
        paddingTop: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '300',
          color: '#00ff88',
          marginBottom: '1rem'
        }}>
          {isGerman ? 'Verwandte Artikel' : 'Related Articles'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/blog/steve-jobs-method" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            → {isGerman ? 'Steve Jobs\' Produktivitätsmethode' : 'Steve Jobs\' Productivity Method'}
          </Link>
          <Link to="/blog/kevin-oleary-was-right" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            → {isGerman ? 'Kevin O\'Leary hatte Recht über Produktivität' : 'Kevin O\'Leary Was Right About Productivity'}
          </Link>
          <Link to="/blog/75-percent-tasks" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            → {isGerman ? 'Warum 75% deiner Aufgaben unwichtig sind' : 'Why 75% of Your Tasks Don\'t Matter'}
          </Link>
        </div>
      </div>

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
            <>Dieser Artikel basiert auf Forschungen von Barry Schwartz, Cal Newport, Reid Hoffman und anderen führenden Experten für Entscheidungspsychologie und Produktivität.</>
          ) : (
            <>This article is based on research by Barry Schwartz, Cal Newport, Reid Hoffman and other leading experts in decision psychology and productivity.</>
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