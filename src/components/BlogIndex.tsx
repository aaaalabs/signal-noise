import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  titleDe?: string;
  description: string;
  descriptionDe?: string;
  date: string;
  readTime: string;
  keywords: string[];
  publishDate: string;
  isPublished?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'steve-jobs-method',
    title: 'Steve Jobs\' Productivity Method',
    titleDe: 'Steve Jobs\' Produktivitätsmethode',
    description: 'The origin story of Signal vs Noise',
    descriptionDe: 'Die Entstehungsgeschichte von Signal vs Noise',
    date: '21 Sept 2025',
    readTime: '3 min',
    keywords: ['steve jobs', 'productivity', '80/20'],
    publishDate: '2025-09-21',
    isPublished: true
  },
  {
    slug: '75-percent-tasks',
    title: 'Why 75% of Your Tasks Don\'t Matter',
    titleDe: 'Warum 75% deiner Aufgaben unwichtig sind',
    description: 'Data from 1,247 founders',
    descriptionDe: 'Daten von 1.247 Gründern',
    date: '14 Sept 2025',
    readTime: '5 min',
    keywords: ['productivity', 'tasks', 'founders'],
    publishDate: '2025-09-14',
    isPublished: true
  },
  {
    slug: 'elon-musk-100-signal',
    title: 'The Elon Musk 100% Signal Experiment',
    titleDe: 'Das Elon Musk 100% Signal Experiment',
    description: 'How to achieve complete focus',
    descriptionDe: 'Wie man vollständigen Fokus erreicht',
    date: '7 Sept 2025',
    readTime: '4 min',
    keywords: ['elon musk', 'focus', 'productivity'],
    publishDate: '2025-09-07',
    isPublished: true
  },
  {
    slug: 'kevin-oleary-was-right',
    title: 'Kevin O\'Leary Was Right About Productivity',
    titleDe: 'Kevin O\'Leary hatte Recht über Produktivität',
    description: 'Shark Tank investor\'s brutal truth about productivity from working with Steve Jobs',
    descriptionDe: 'Die brutale Wahrheit des Shark Tank Investors über Produktivität aus der Arbeit mit Steve Jobs',
    date: '29 Sept 2025',
    readTime: '4 min',
    keywords: ['kevin oleary', 'shark tank', 'productivity'],
    publishDate: '2025-09-29',
    isPublished: false
  },
  {
    slug: 'founder-productivity-paradox',
    title: 'The Founder\'s Paradox: Why Freedom Kills Focus',
    titleDe: 'Das Gründer-Paradoxon: Warum Freiheit den Fokus zerstört',
    description: 'Why entrepreneurial freedom kills focus and how the Signal vs Noise method helps founders overcome the productivity paradox',
    descriptionDe: 'Warum unternehmerische Freiheit den Fokus zerstört und wie die Signal vs Noise Methode Gründern hilft, das Produktivitäts-Paradoxon zu überwinden',
    date: '6 Oct 2025',
    readTime: '8 min',
    keywords: ['founder productivity paradox', 'entrepreneur focus challenges', 'freedom kills productivity'],
    publishDate: '2025-10-06',
    isPublished: false
  },
  {
    slug: 'signal-vs-noise-philosophy',
    title: 'Signal vs Noise: A Philosophy for Modern Life',
    titleDe: 'Signal vs Noise: Eine Philosophie für das moderne Leben',
    description: 'How information theory revolutionizes productivity and decision-making',
    descriptionDe: 'Wie die Informationstheorie Produktivität und Entscheidungsfindung revolutioniert',
    date: '13 Oct 2025',
    readTime: '6 min',
    keywords: ['signal vs noise', 'philosophy', 'information theory'],
    publishDate: '2025-10-13',
    isPublished: false
  },
  {
    slug: '90-day-tracking-experiment',
    title: 'My 90-Day Signal vs Noise Experiment: Shocking Results',
    titleDe: 'Mein 90-Tage Signal vs Noise Experiment: Schockierende Ergebnisse',
    description: 'Personal case study: How I went from 23% to 81% signal ratio—and why day 47 changed everything',
    descriptionDe: 'Persönliche Fallstudie: Wie ich von 23% auf 81% Signal-Verhältnis kam—und warum Tag 47 alles veränderte',
    date: '20 Oct 2025',
    readTime: '8 min',
    keywords: ['productivity tracking 90 day challenge', 'signal ratio experiment', 'personal productivity case study'],
    publishDate: '2025-10-20',
    isPublished: false
  },
  {
    slug: 'focus-age-distraction',
    title: 'Focus in the Age of Distraction: The New Digital Reality',
    titleDe: 'Fokus im Zeitalter der Ablenkung: Die neue digitale Realität',
    description: 'Cal Newport\'s digital minimalism meets Signal vs Noise thinking for the attention economy',
    descriptionDe: 'Cal Newports digitaler Minimalismus trifft auf Signal vs Noise Denken für die Aufmerksamkeitsökonomie',
    date: '27 Oct 2025',
    readTime: '7 min',
    keywords: ['digital minimalism focus', 'cal newport deep work', 'attention economy resistance'],
    publishDate: '2025-10-27',
    isPublished: false
  },
  {
    slug: 'mathematics-productivity',
    title: 'The Mathematics of Productivity: Why 80% of Your Tasks Don\'t Matter',
    titleDe: 'Die Mathematik der Produktivität: Warum 80% Ihrer Aufgaben unwichtig sind',
    description: 'Mathematical proof behind the Pareto Principle and power law distributions in productivity',
    descriptionDe: 'Mathematischer Beweis hinter dem Pareto-Prinzip und Potenzgesetz-Verteilungen in der Produktivität',
    date: '3 Nov 2025',
    readTime: '9 min',
    keywords: ['pareto principle mathematics', '80/20 rule mathematical proof', 'power law productivity'],
    publishDate: '2025-11-03',
    isPublished: false
  },
  {
    slug: 'building-signal-noise-story',
    title: 'Building Signal/Noise: From Crisis to App',
    titleDe: 'Building Signal/Noise: Von der Krise zur App',
    description: 'Founder journey from personal productivity struggles to app creation',
    descriptionDe: 'Gründerreise von persönlichen Produktivitätsproblemen zur App-Erstellung',
    date: '10 Nov 2025',
    readTime: '6 min',
    keywords: ['startup story', 'app development', 'founder journey'],
    publishDate: '2025-11-10',
    isPublished: false
  }
];

export default function BlogIndex() {
  const { currentLanguage } = useLanguage();
  const isGerman = currentLanguage === 'de';

  useEffect(() => {
    // SEO meta tags
    document.title = isGerman
      ? 'Signal/Blog - Produktivität neu gedacht'
      : 'Signal/Blog - Rethinking Productivity';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', isGerman
        ? 'Entdecke die Produktivitätsmethoden von Steve Jobs, Elon Musk und anderen Visionären.'
        : 'Discover the productivity methods of Steve Jobs, Elon Musk and other visionaries.'
      );
    }
  }, [isGerman]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '2rem'
    }}>
      {/* Navigation */}
      <nav style={{
        maxWidth: '680px',
        margin: '0 auto 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: '#00ff88',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '300'
        }}>
          ← {isGerman ? 'App' : 'App'}
        </Link>
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          fontWeight: '100'
        }}>
          Signal/Blog
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        {/* Articles List */}
        <div style={{ marginTop: '3rem' }}>
          {blogPosts.filter(post => post.isPublished).map((post, index) => (
            <article key={post.slug} style={{ marginBottom: '3rem' }}>
              {index > 0 && (
                <div style={{
                  borderTop: '1px solid #222',
                  margin: '3rem 0',
                  width: '100%'
                }} />
              )}

              <Link
                to={`/blog/${post.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: '300',
                  color: '#fff',
                  marginBottom: '0.5rem',
                  lineHeight: '1.4'
                }}>
                  {isGerman && post.titleDe ? post.titleDe : post.title}
                </h2>

                <p style={{
                  fontSize: '1rem',
                  color: '#999',
                  marginBottom: '0.5rem',
                  lineHeight: '1.6'
                }}>
                  {isGerman && post.descriptionDe ? post.descriptionDe : post.description}
                </p>

                <div style={{
                  fontSize: '0.85rem',
                  color: '#666',
                  display: 'flex',
                  gap: '1rem',
                  fontWeight: '100'
                }}>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} {isGerman ? 'Lesezeit' : 'read'}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div style={{
          borderTop: '1px solid #222',
          marginTop: '4rem',
          paddingTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            {isGerman
              ? 'Weitere Artikel folgen wöchentlich'
              : 'More articles coming weekly'}
          </p>
        </div>
      </main>
    </div>
  );
}