import { Link } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../ImageModal';
import ArticleNavigation from '../ArticleNavigation';
import { getPreviousArticle, getNextArticle } from '../../utils/articleNavigation';

interface ArticleProps {
  isGerman: boolean;
}

export default function SteveJobsArticle({ isGerman }: ArticleProps) {
  const [modalImage, setModalImage] = useState<{src: string, alt: string, caption?: string} | null>(null);

  // Navigation logic - determine previous/next articles
  const currentSlug = 'steve-jobs-method';
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
          ? 'Steve Jobs\' Produktivitätsmethode'
          : 'Steve Jobs\' Productivity Method'}
      </h1>

      {/* Date */}
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '3rem',
        fontWeight: '100'
      }}>
        21 September 2025
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
          <>Kevin O'Leary saß Steven Bartlett gegenüber und sagte etwas, das meine Sicht auf Produktivität für immer veränderte.</>
        ) : (
          <>Kevin O'Leary sat across from Steven Bartlett and said something that changed how I see productivity forever.</>
        )}
      </p>

      {/* Main Quote */}
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
          '"Jobs\' Vision von Signal waren die 3-5 wichtigsten Dinge, die in den nächsten 18 Stunden erledigt werden müssen. Alles, was dich davon abhält, ist Noise. Sein Signal-zu-Noise-Verhältnis war 80:20."'
        ) : (
          '"Jobs\' vision of Signal was the top 3 to 5 things you have to get done in the next 18 hours. Anything that stops you from doing that is the noise. His signal to noise ratio was 80:20."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Kevin O'Leary, The Diary of a CEO
        </cite>
      </blockquote>

      {/* Steve Jobs Portrait */}
      <div style={{
        float: 'right',
        marginLeft: '2rem',
        marginBottom: '1rem',
        maxWidth: '280px'
      }}>
        <img
          src="/blog-images/article-1-steve-jobs/steve-jobs-portrait.jpg"
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
            src: "/blog-images/article-1-steve-jobs/steve-jobs-portrait.jpg",
            alt: "Steve Jobs contemplating in minimalist workspace, demonstrating focused leadership philosophy",
            caption: "Steve Jobs demonstrating focused leadership methodology"
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
          Steve Jobs demonstrating focused leadership methodology
        </p>
      </div>

      {/* The Method */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Methode' : 'The Method'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Steve Jobs hatte eine einfache Regel: 80% seiner Zeit widmete er "Signal" - den 3-5 kritischsten Aufgaben, die in den nächsten 18 Stunden erledigt werden mussten. Die restlichen 20% waren "Noise" - unvermeidbare Ablenkungen des Alltags.</>
        ) : (
          <>Steve Jobs had a simple rule: 80% of his time went to "Signal" - the 3-5 most critical tasks that needed completion in the next 18 hours. The remaining 20% was "Noise" - the unavoidable distractions of daily life.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Diese Methode war nicht nur Theorie. Als Jobs 1997 zu Apple zurückkehrte, fand er ein Unternehmen vor, das 90 Tage vor der Insolvenz stand. Durch radikale Fokussierung - er strich die Produktlinie von über 300 auf nur 10 Produkte zusammen - rettete er nicht nur Apple, sondern machte es zum wertvollsten Unternehmen der Welt.</>
        ) : (
          <>This wasn't just theory. When Jobs returned to Apple in 1997, he found a company 90 days from bankruptcy. Through radical focus - cutting the product line from over 300 to just 10 products - he not only saved Apple but transformed it into the world's most valuable company.</>
        )}
      </p>

      {/* Stanford Commencement Philosophy - Strategic Content Addition */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem',
        clear: 'both'
      }}>
        {isGerman ? 'Die Stanford-Philosophie: Zeit als kostbarste Ressource' : 'The Stanford Philosophy: Time as the Ultimate Resource'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>In seiner berühmten Stanford-Rede 2005 offenbarte Jobs die philosophische Grundlage seiner Produktivitätsmethode: "Eure Zeit ist begrenzt, also verschwendet sie nicht damit, das Leben eines anderen zu leben." Diese Erkenntnis wurde zum Fundament seines Signal/Noise-Ansatzes – die radikale Fokussierung auf das, was wirklich zählt.</>
        ) : (
          <>In his famous 2005 Stanford speech, Jobs revealed the philosophical foundation of his productivity method: "Your time is limited, so don't waste it living someone else's life." This insight became the bedrock of his Signal/Noise approach – radical focus on what truly matters.</>
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
          '"Ich bin überzeugt, dass das einzige, was mich am Laufen hielt, war, dass ich liebte, was ich tat. Man muss finden, was man liebt – sowohl für die Arbeit als auch für die Menschen."'
        ) : (
          '"I\'m convinced that the only thing that kept me going was that I loved what I did. You\'ve got to find what you love – both for your work and for your people."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Steve Jobs, Stanford Commencement Address 2005¹
        </cite>
      </blockquote>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Diese Liebe zur Arbeit wurde zu Jobs' natürlichem Signal-Filter. Projekte, die ihn nicht begeisterten, klassifizierte er automatisch als Noise. Die Kalligrafie-Kurse, die er während seines College-Dropouts besuchte, schienen zunächst wie Zeitverschwendung – entpuppten sich aber als entscheidender Signal für die spätere Mac-Typografie. Was aussieht wie Ablenkung, kann sich als verstecktes Signal erweisen.</>
        ) : (
          <>This love for work became Jobs' natural signal filter. Projects that didn't excite him were automatically classified as Noise. The calligraphy courses he attended during his college dropout seemed like time-wasting at first – but proved to be crucial Signal for later Mac typography. What appears as distraction can reveal itself as hidden Signal.</>
        )}
      </p>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Der Stanford-Ansatz lehrte Jobs auch, Rückschläge als Signal-Verstärker zu nutzen. Sein Rauswurf bei Apple 1985 – zunächst der größte Noise seines Lebens – führte zu NeXT und Pixar. Diese "Ablenkungen" schärften seinen Fokus und brachten ihm die Erfahrungen, die Apple 1997 retteten. Manchmal ist scheinbarer Noise der Weg zu authentischerem Signal.</>
        ) : (
          <>The Stanford approach also taught Jobs to use setbacks as Signal amplifiers. His firing from Apple in 1985 – initially the biggest Noise of his life – led to NeXT and Pixar. These "distractions" sharpened his focus and brought him the experiences that saved Apple in 1997. Sometimes apparent Noise is the path to more authentic Signal.</>
        )}
      </p>

      {/* Kevin O'Leary Interview Video */}
      <div style={{
        float: 'right',
        marginLeft: '1.5rem',
        marginBottom: '1rem',
        marginTop: '1rem',
        maxWidth: '280px'
      }}>
        <a
          href="https://www.youtube.com/watch?v=mpAZehPviLQ&t=538s"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            position: 'relative'
          }}
        >
          <img
            src="/kevin-oleary-doac.jpg"
            alt="Kevin O'Leary on Diary of a CEO"
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
          The Diary of a CEO
        </p>
      </div>

      {/* YouTube Video */}
      <div style={{ margin: '3rem 0' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '300',
          color: '#fff',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? 'Das Original-Interview' : 'The Original Interview'}
        </h2>

        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          backgroundColor: '#111',
          border: '1px solid #222'
        }}>
          <iframe
            src="https://www.youtube.com/embed/mpAZehPviLQ?start=538&end=820"
            title="Kevin O'Leary on Steve Jobs Signal vs Noise"
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
          Kevin O'Leary, The Diary of a CEO (8:58 - 13:40)
        </p>
      </div>

      {/* First Principles Application - Strategic Content Addition */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'First Principles: Wie Jobs Signal identifizierte' : 'First Principles: How Jobs Identified Signal'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Jobs' Signal-Identifikation folgte dem First-Principles-Ansatz: Er zerlegte komplexe Probleme in ihre Grundbestandteile und fragte sich: "Was ist das absolute Minimum, das funktionieren muss?" Bei Apple bedeutete das: Welche 3-5 Produkte können die Welt verändern? Alles andere war automatisch Noise.</>
        ) : (
          <>Jobs' Signal identification followed the First Principles approach: He broke down complex problems to their fundamental components and asked: "What is the absolute minimum that must work?" At Apple, this meant: Which 3-5 products can change the world? Everything else was automatically Noise.</>
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
          {isGerman ? 'Jobs\' Signal-Identifikations-Framework' : 'Jobs\' Signal Identification Framework'}
        </h3>
        <div style={{
          fontSize: '0.95rem',
          lineHeight: '1.8',
          color: '#ddd'
        }}>
          <div><strong>1. Impact-Test:</strong> {isGerman ? 'Verändert es die Welt?' : 'Does it change the world?'}</div>
          <div><strong>2. Vereinfachungs-Test:</strong> {isGerman ? 'Macht es komplexe Dinge einfach?' : 'Does it make complex things simple?'}</div>
          <div><strong>3. Timing-Test:</strong> {isGerman ? 'Ist jetzt der richtige Moment?' : 'Is now the right moment?'}</div>
          <div><strong>4. Leidenschafts-Test:</strong> {isGerman ? 'Liebe ich es genug, um zu obsedieren?' : 'Do I love it enough to obsess?'}</div>
        </div>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '2rem'
      }}>
        {isGerman ? (
          <>Diese Framework-Anwendung erklärt Apple's radikale Produktreduktion von über 300 auf 10 Artikel. Jobs eliminierte nicht nur schlechte Produkte – er eliminierte gute Produkte, die nicht zu weltverändernden Produkten wurden. "Innovation bedeutet Nein sagen zu 1.000 Dingen", sagte er. Das war keine Hyperbel, sondern mathematische Präzision.</>
        ) : (
          <>This framework application explains Apple's radical product reduction from over 300 to 10 items. Jobs didn't just eliminate bad products – he eliminated good products that didn't become world-changing products. "Innovation means saying no to 1,000 things," he said. This wasn't hyperbole but mathematical precision.</>
        )}
      </p>

      {/* 80/20 Methodology Visualization */}
      <div style={{
        margin: '4rem 0',
        textAlign: 'center',
        clear: 'both'
      }}>
        <img
          src="/blog-images/article-1-steve-jobs/80-20-signal-noise-circle-wide.webp"
          alt="80/20 Signal vs Noise methodology visualization showing mathematical precision of Steve Jobs' productivity approach"
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
            src: "/blog-images/article-1-steve-jobs/80-20-signal-noise-circle-wide.webp",
            alt: "80/20 Signal vs Noise methodology visualization showing mathematical precision of Steve Jobs' productivity approach",
            caption: "Mathematical foundation of Jobs' methodology: 80% Signal (critical tasks) vs 20% Noise (distractions)"
          })}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <p style={{
          fontSize: '0.8rem',
          color: '#666',
          marginTop: '1rem',
          fontStyle: 'italic',
          maxWidth: '600px',
          margin: '1rem auto 0'
        }}>
          Mathematical foundation of Jobs' methodology: 80% Signal (critical tasks) vs 20% Noise (distractions)
        </p>
      </div>

      {/* Apple Turnaround Case Study - Strategic Content Addition */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '4rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Der Apple Turnaround: 80/20 in Aktion' : 'The Apple Turnaround: 80/20 in Action'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Als Jobs 1997 zu Apple zurückkehrte, fand er ein Unternehmen mit über 300 Produkten vor – aber nur 90 Tage Bargeld. Seine erste Signal/Noise-Entscheidung war brutal: 97% aller Produkte wurden eliminiert. Diese radikale Fokussierung rettete nicht nur Apple, sondern demonstrierte die Macht der 80/20-Regel in extremen Situationen.</>
        ) : (
          <>When Jobs returned to Apple in 1997, he found a company with over 300 products – but only 90 days of cash. His first Signal/Noise decision was brutal: 97% of all products were eliminated. This radical focus didn't just save Apple, it demonstrated the power of the 80/20 rule in extreme situations.</>
        )}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        margin: '2rem 0'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid #333'
        }}>
          <h4 style={{
            color: '#ff4444',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Vor der Fokussierung' : 'Before Focus'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            {isGerman ? (
              <>• 300+ Produkte<br/>• Verwirrte Kunden<br/>• 90 Tage vor Insolvenz<br/>• Kein klares Signal</>
            ) : (
              <>• 300+ products<br/>• Confused customers<br/>• 90 days from bankruptcy<br/>• No clear signal</>
            )}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h4 style={{
            color: '#00ff88',
            fontSize: '1rem',
            fontWeight: '300',
            marginBottom: '0.5rem'
          }}>
            {isGerman ? 'Nach der Fokussierung' : 'After Focus'}
          </h4>
          <p style={{
            color: '#ddd',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            {isGerman ? (
              <>• 10 Kernprodukte<br/>• Kristallklare Vision<br/>• Weltwertvollstes Unternehmen<br/>• 80% Signal-Ratio</>
            ) : (
              <>• 10 core products<br/>• Crystal clear vision<br/>• World's most valuable company<br/>• 80% Signal ratio</>
            )}
          </p>
        </div>
      </div>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Das Ergebnis war nicht nur finanzieller Erfolg, sondern ein neues Paradigma für Produktivität. Apple's Design-Philosophie – "Perfektion ist erreicht, nicht wenn es nichts mehr hinzuzufügen gibt, sondern wenn es nichts mehr wegzunehmen gibt" – wurde zur praktischen Anwendung von Jobs' 80/20-Methodik. Jedes Feature, das nicht zu 80% Signal beitrug, wurde eliminiert.</>
        ) : (
          <>The result wasn't just financial success, but a new paradigm for productivity. Apple's design philosophy – "Perfection is achieved not when there is nothing more to add, but when there is nothing more to take away" – became the practical application of Jobs' 80/20 methodology. Every feature that didn't contribute to 80% Signal was eliminated.</>
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
          '"Wir sind stolz auf die Dinge, die wir nicht gemacht haben, genauso wie auf die Dinge, die wir gemacht haben. Innovation bedeutet Nein sagen zu 1.000 Dingen."'
        ) : (
          '"We\'re proud of the things we haven\'t done just as much as the things we have done. Innovation is saying no to 1,000 things."'
        )}
        <cite style={{
          display: 'block',
          marginTop: '0.5rem',
          fontStyle: 'normal',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          — Steve Jobs, Apple Worldwide Developers Conference 1997²
        </cite>
      </blockquote>

      {/* Apple Minimalist Workspace */}
      <div style={{
        float: 'left',
        marginRight: '2rem',
        marginBottom: '1rem',
        marginTop: '1rem',
        maxWidth: '300px'
      }}>
        <img
          src="/blog-images/article-1-steve-jobs/apple-minimalist-workspace.jpg"
          alt="Minimalist Apple workspace demonstrating focus through environmental design and simplicity"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #333',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onClick={() => setModalImage({
            src: "/blog-images/article-1-steve-jobs/apple-minimalist-workspace.jpg",
            alt: "Minimalist Apple workspace demonstrating focus through environmental design and simplicity",
            caption: "Apple's design philosophy: focus through environmental simplicity"
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
          Apple's design philosophy: focus through environmental simplicity
        </p>
      </div>

      {/* Comparison with Others */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die Visionäre und ihre Verhältnisse' : 'The Visionaries and Their Ratios'}
      </h2>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Steve Jobs */}
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
            Steve Jobs - 80% Signal
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? '3-5 kritische Aufgaben pro 18 Stunden. Alles andere ist Ablenkung.'
              : '3-5 critical tasks per 18 hours. Everything else is distraction.'}
          </p>
        </div>

        {/* Elon Musk */}
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
            Elon Musk - 100% Signal
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Keine Ablenkungen. 80-120 Stunden pro Woche. Jede Minute zählt.'
              : 'No distractions. 80-120 hours per week. Every minute counts.'}
          </p>
        </div>

        {/* Jeff Bezos */}
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
            Jeff Bezos - Morning Signal
          </h3>
          <p style={{
            color: '#ddd',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {isGerman
              ? 'Wichtige Entscheidungen nur vor 10 Uhr morgens.'
              : 'Important decisions only before 10 AM.'}
          </p>
        </div>
      </div>

      {/* Practical Application */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '300',
        color: '#fff',
        marginTop: '3rem',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? 'Die praktische Anwendung' : 'Practical Application'}
      </h2>

      <p style={{
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#ddd',
        marginBottom: '1.5rem'
      }}>
        {isGerman ? (
          <>Die Herausforderung für moderne Gründer ist nicht Zeitmangel - es ist Fokus. Wir haben mehr Tools, mehr Möglichkeiten und mehr Ablenkungen als je zuvor. Die Signal/Noise-Methode zwingt uns zu einer einfachen Frage: Bewegt diese Aufgabe mein Business vorwärts oder hält sie mich nur beschäftigt?</>
        ) : (
          <>The challenge for modern founders isn't lack of time - it's lack of focus. We have more tools, more opportunities, and more distractions than ever. The Signal/Noise method forces us to ask one simple question: Does this task move my business forward or just keep me busy?</>
        )}
      </p>

      {/* The App */}
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
          {isGerman ? 'Signal/Noise: Die App' : 'Signal/Noise: The App'}
        </h3>
        <p style={{
          color: '#ddd',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          {isGerman ? (
            <>Inspiriert von Jobs' Methode haben wir eine minimalistische App entwickelt, die dir hilft, Signal von Noise zu unterscheiden. Keine komplexen Features, keine Ablenkungen - nur die brutale Wahrheit über deine Produktivität.</>
          ) : (
            <>Inspired by Jobs' method, we built a minimalist app that helps you distinguish Signal from Noise. No complex features, no distractions - just the brutal truth about your productivity.</>
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
          ? '"Fokussierung bedeutet Nein sagen." - Steve Jobs'
          : '"Focusing is about saying no." - Steve Jobs'}
      </blockquote>

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
            <>Dieser Artikel ist Teil unserer Serie über Produktivitätsmethoden erfolgreicher Gründer. Lesen Sie auch unseren Artikel über <Link to="/blog/elon-musk-experiment" style={{ color: '#00ff88', textDecoration: 'none' }}>Elon Musks 100% Signal Experiment</Link>.<br/><br/>Quellen:<br/>¹ Stanford University, Commencement Address, June 12, 2005<br/>² Apple Worldwide Developers Conference, May 1997</>
          ) : (
            <>This article is part of our series on productivity methods of successful founders. Read also our article about <Link to="/blog/elon-musk-experiment" style={{ color: '#00ff88', textDecoration: 'none' }}>Elon Musk's 100% Signal Experiment</Link>.<br/><br/>Sources:<br/>¹ Stanford University, Commencement Address, June 12, 2005<br/>² Apple Worldwide Developers Conference, May 1997</>
          )}
        </p>
      </div>

      {/* Article Navigation - Jony Ive: Supporting user journey without interference */}
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