import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

// Import individual article components
import SteveJobsArticle from './articles/SteveJobsArticle';
import SeventyFivePercentArticle from './articles/SeventyFivePercentArticle';
import ElonMuskArticle from './articles/ElonMuskArticle';
import KevinOLearyArticle from './articles/KevinOLearyArticle';
import FoundersParadoxArticle from './articles/FoundersParadoxArticle';
import SignalVsNoisePhilosophyArticle from './articles/SignalVsNoisePhilosophyArticle';
import NinetyDayTrackingArticle from './articles/NinetyDayTrackingArticle';
import FocusAgeDistractionArticle from './articles/FocusAgeDistractionArticle';
import MathematicsProductivityArticle from './articles/MathematicsProductivityArticle';

// Import blog posts configuration
import { blogPosts } from './BlogIndex';

interface ArticleContent {
  component: React.ComponentType<{ isGerman: boolean }>;
  title: string;
  titleDe: string;
  description: string;
  descriptionDe: string;
  keywords: string[];
  publishDate: string;
}

const articles: Record<string, ArticleContent> = {
  'steve-jobs-method': {
    component: SteveJobsArticle,
    title: 'Steve Jobs\' Productivity Method: The 80/20 Signal vs Noise Approach',
    titleDe: 'Steve Jobs\' Produktivitätsmethode: Der 80/20 Signal vs Noise Ansatz',
    description: 'Discover how Steve Jobs used the Signal vs Noise method to achieve 80% productivity, as explained by Kevin O\'Leary. Learn the 3-5 critical tasks principle.',
    descriptionDe: 'Entdecke wie Steve Jobs die Signal vs Noise Methode nutzte um 80% Produktivität zu erreichen, erklärt von Kevin O\'Leary. Lerne das 3-5 kritische Aufgaben Prinzip.',
    keywords: ['steve jobs productivity', 'signal vs noise', '80/20 rule', 'kevin oleary', 'productivity method'],
    publishDate: '2025-09-21'
  },
  '75-percent-tasks': {
    component: SeventyFivePercentArticle,
    title: 'Why 75% of Your Tasks Don\'t Matter: Data from 1,247 Founders',
    titleDe: 'Warum 75% deiner Aufgaben unwichtig sind: Daten von 1.247 Gründern',
    description: 'Shocking data from 1,247 startup founders reveals that only 8.7% of planned tasks actually create value. Learn why most of your to-do list is noise.',
    descriptionDe: 'Schockierende Daten von 1.247 Startup-Gründern zeigen, dass nur 8,7% der geplanten Aufgaben tatsächlich Wert schaffen. Erfahre, warum der Großteil deiner To-Do-Liste Noise ist.',
    keywords: ['productivity statistics', 'founder productivity', 'task prioritization', '80/20 rule', 'pareto principle'],
    publishDate: '2025-09-14'
  },
  'elon-musk-100-signal': {
    component: ElonMuskArticle,
    title: 'The Elon Musk 100% Signal Experiment: How to Achieve Complete Focus',
    titleDe: 'Das Elon Musk 100% Signal Experiment: Wie man vollständigen Fokus erreicht',
    description: 'Elon Musk operates at 100% Signal according to Kevin O\'Leary. Discover his 5-minute time boxing method and the true cost of eliminating all noise.',
    descriptionDe: 'Elon Musk arbeitet laut Kevin O\'Leary bei 100% Signal. Entdecke seine 5-Minuten-Timeboxing-Methode und den wahren Preis der Eliminierung aller Ablenkungen.',
    keywords: ['elon musk productivity', '100% focus', 'time boxing', 'deep work', 'extreme productivity'],
    publishDate: '2025-09-07'
  },
  'kevin-oleary-was-right': {
    component: KevinOLearyArticle,
    title: 'Kevin O\'Leary Was Right About Productivity: The Shark Tank Formula',
    titleDe: 'Kevin O\'Leary hatte Recht über Produktivität: Die Shark Tank Formel',
    description: 'Kevin O\'Leary worked directly with Steve Jobs and revealed the brutal 80/20 Signal vs Noise formula that transformed Apple. Learn the productivity secrets from Shark Tank\'s "Mr. Wonderful".',
    descriptionDe: 'Kevin O\'Leary arbeitete direkt mit Steve Jobs und enthüllte die brutale 80/20 Signal vs Noise Formel, die Apple transformierte. Lerne die Produktivitätsgeheimnisse von Shark Tanks "Mr. Wonderful".',
    keywords: ['kevin oleary productivity', 'shark tank productivity', 'steve jobs signal noise', '80/20 productivity', 'entrepreneurial focus'],
    publishDate: '2025-09-29'
  },
  'founder-productivity-paradox': {
    component: FoundersParadoxArticle,
    title: 'The Founder\'s Paradox: Why Freedom Kills Focus (And How to Fight Back)',
    titleDe: 'Das Gründer-Paradoxon: Warum Freiheit den Fokus zerstört',
    description: 'Discover why entrepreneurial freedom kills focus and how the Signal vs Noise method helps founders overcome the productivity paradox. Data from 1,247 entrepreneurs reveals the brutal truth.',
    descriptionDe: 'Entdecke warum unternehmerische Freiheit den Fokus zerstört und wie die Signal vs Noise Methode Gründern hilft, das Produktivitäts-Paradoxon zu überwinden. Daten von 1.247 Unternehmern enthüllen die brutale Wahrheit.',
    keywords: ['founder productivity paradox', 'entrepreneur focus challenges', 'freedom kills productivity', 'startup CEO time management', 'entrepreneurial decision fatigue'],
    publishDate: '2025-10-06'
  },
  'signal-vs-noise-philosophy': {
    component: SignalVsNoisePhilosophyArticle,
    title: 'Signal vs Noise: A Philosophy for Modern Life',
    titleDe: 'Signal vs Noise: Eine Philosophie für das moderne Leben',
    description: 'How information theory became the secret weapon of history\'s most focused achievers. Discover binary thinking for breakthrough productivity and decision-making clarity.',
    descriptionDe: 'Wie die Informationstheorie zur Geheimwaffe der fokussiertesten Menschen der Geschichte wurde. Entdecke binäres Denken für Durchbruch-Produktivität und Entscheidungsklarheit.',
    keywords: ['signal vs noise meaning', 'information theory productivity', 'binary decision making', 'claude shannon productivity', 'focus philosophy'],
    publishDate: '2025-10-13'
  },
  '90-day-tracking-experiment': {
    component: NinetyDayTrackingArticle,
    title: 'My 90-Day Signal vs Noise Experiment: Shocking Results',
    titleDe: 'Mein 90-Tage Signal vs Noise Experiment: Schockierende Ergebnisse',
    description: 'Personal case study: How I went from 23% to 81% signal ratio—and why day 47 changed everything. Real data from a 90-day productivity tracking experiment.',
    descriptionDe: 'Persönliche Fallstudie: Wie ich von 23% auf 81% Signal-Verhältnis kam—und warum Tag 47 alles veränderte. Echte Daten aus einem 90-tägigen Produktivitäts-Tracking-Experiment.',
    keywords: ['productivity tracking 90 day challenge', 'signal ratio experiment', 'personal productivity case study', 'tracking productivity results', '90 day productivity transformation'],
    publishDate: '2025-10-20'
  },
  'focus-age-distraction': {
    component: FocusAgeDistractionArticle,
    title: 'Focus in the Age of Distraction: The New Digital Reality',
    titleDe: 'Fokus im Zeitalter der Ablenkung: Die neue digitale Realität',
    description: 'Cal Newport\'s digital minimalism meets Signal vs Noise thinking. Learn to maintain focus in a world designed to fragment your attention.',
    descriptionDe: 'Cal Newports digitaler Minimalismus trifft auf Signal vs Noise Denken. Lerne, Fokus in einer Welt zu bewahren, die darauf ausgelegt ist, deine Aufmerksamkeit zu fragmentieren.',
    keywords: ['digital minimalism focus', 'cal newport deep work', 'attention economy resistance', 'focus in distraction age', 'technology boundaries productivity'],
    publishDate: '2025-10-27'
  },
  'mathematics-productivity': {
    component: MathematicsProductivityArticle,
    title: 'The Mathematics of Productivity: Why 80% of Your Tasks Don\'t Matter',
    titleDe: 'Die Mathematik der Produktivität: Warum 80% Ihrer Aufgaben unwichtig sind',
    description: 'Mathematical proof behind the Pareto Principle: How power law distributions explain why most tasks generate little value and how to optimize accordingly.',
    descriptionDe: 'Mathematischer Beweis hinter dem Pareto-Prinzip: Wie Potenzgesetz-Verteilungen erklären, warum die meisten Aufgaben wenig Wert erzeugen und wie man entsprechend optimiert.',
    keywords: ['pareto principle mathematics', '80/20 rule mathematical proof', 'power law productivity', 'mathematical optimization productivity', 'task value distribution'],
    publishDate: '2025-11-03'
  }
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const isGerman = currentLanguage === 'de';

  const article = slug ? articles[slug] : null;
  const blogPost = blogPosts.find(post => post.slug === slug);

  // Check if article is published
  const isArticlePublished = blogPost?.isPublished ?? false;

  useEffect(() => {
    if (article) {
      // Update page title
      document.title = isGerman ? article.titleDe : article.title;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', isGerman ? article.descriptionDe : article.description);
      }

      // Add article structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": isGerman ? article.titleDe : article.title,
        "description": isGerman ? article.descriptionDe : article.description,
        "keywords": article.keywords.join(', '),
        "datePublished": article.publishDate,
        "author": {
          "@type": "Organization",
          "name": "Signal/Noise"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Libralab.ai",
          "url": "https://libralab.ai"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [article, isGerman]);

  if (!article || !isArticlePublished) {
    return <Navigate to="/blog" replace />;
  }

  const ArticleComponent = article.component;

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
        margin: '0 auto 4rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Link to="/blog" style={{
          color: '#666',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: '300',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
        >
          ← {isGerman ? 'Blog' : 'Blog'}
        </Link>
      </nav>

      {/* Article Content */}
      <article style={{
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        <ArticleComponent isGerman={isGerman} />
      </article>
    </div>
  );
}