import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';
import ArticleSchemas from './ArticleSchemas';

// Import individual article components
import SteveJobsArticle from './articles/SteveJobsArticle';
import SeventyFivePercentArticle from './articles/SeventyFivePercentArticle';
import ElonMuskArticle from './articles/ElonMuskArticle';
import KevinOLearyArticle from './articles/KevinOLearyArticle';
import FoundersParadoxArticle from './articles/FoundersParadoxArticle';
import SignalVsNoisePhilosophyArticle from './articles/SignalVsNoisePhilosophyArticleV3';
import NinetyDayTrackingArticle from './articles/NinetyDayTrackingArticle';
import FocusAgeDistractionArticle from './articles/FocusAgeDistractionArticle';
import MathematicsProductivityArticle from './articles/MathematicsProductivityArticle';
import BuildingSignalNoiseStoryArticle from './articles/BuildingSignalNoiseStoryArticle';
import ThreeThingsProductivityArticle from './articles/ThreeThingsProductivityArticle';

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
  },
  'building-signal-noise-story': {
    component: BuildingSignalNoiseStoryArticle,
    title: 'Building Signal/Noise: From Crisis to App',
    titleDe: 'Building Signal/Noise: Von der Krise zur App',
    description: 'Founder journey from personal productivity struggles to app creation. The authentic story behind the Signal vs Noise method and how a 3:47 AM crisis became a productivity revolution.',
    descriptionDe: 'Gründerreise von persönlichen Produktivitätsproblemen zur App-Erstellung. Die authentische Geschichte hinter der Signal vs Noise Methode und wie eine 3:47 Uhr Krise zu einer Produktivitäts-Revolution wurde.',
    keywords: ['startup story', 'app development', 'founder journey', 'productivity crisis', 'signal noise app creation'],
    publishDate: '2025-11-10'
  },
  'three-things-productivity': {
    component: ThreeThingsProductivityArticle,
    title: 'The Three Things Productivity System: The Science of Doing Less to Achieve More',
    titleDe: 'Das Drei-Dinge-Produktivitätssystem: Die Wissenschaft, weniger zu tun und mehr zu erreichen',
    description: 'Learn the research-backed Three Things productivity method. Focus on 3 transformational tasks daily and achieve exponential results. Based on proven frameworks from Buffett, Bezos, and 100+ years of productivity science.',
    descriptionDe: 'Lerne die forschungsbasierte Drei-Dinge-Produktivitätsmethode. Fokussiere dich auf 3 transformative Aufgaben täglich und erreiche exponentielle Ergebnisse. Basierend auf bewährten Frameworks von Buffett, Bezos und 100+ Jahren Produktivitätswissenschaft.',
    keywords: ['three things productivity', 'transformational tasks', 'Ivy Lee method', 'compound effect', 'deep work', 'productivity science'],
    publishDate: '2025-10-04'
  }
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const isGerman = currentLanguage === 'de';

  const article = slug ? articles[slug] : null;
  const blogPost = blogPosts.find(post => post.slug === slug);

  // Check for preview mode via URL parameter
  const isPreviewMode = new URLSearchParams(window.location.search).has('preview');

  // Check if article is published or in preview mode
  const isArticlePublished = blogPost?.isPublished ?? false;
  const canViewArticle = isArticlePublished || isPreviewMode;

  // Debug logging
  if (!article && slug) {
    console.log('Article not found for slug:', slug);
    console.log('Available articles:', Object.keys(articles));
  }
  if (!blogPost && slug) {
    console.log('Blog post not found for slug:', slug);
    console.log('Available blog posts:', blogPosts.map(p => p.slug));
  }

  useEffect(() => {
    if (article && slug) {
      const canonicalUrl = `https://signal-noise.app/blog/${slug}`;

      // Update page title
      document.title = `${isGerman ? article.titleDe : article.title} | Signal/Noise`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', isGerman ? article.descriptionDe : article.description);
      }

      // Add/update canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);

      // Update Open Graph tags
      const updateOrCreateMeta = (property: string, content: string, isProperty = true) => {
        const attr = isProperty ? 'property' : 'name';
        let meta = document.querySelector(`meta[${attr}="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attr, property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      updateOrCreateMeta('og:title', isGerman ? article.titleDe : article.title);
      updateOrCreateMeta('og:description', isGerman ? article.descriptionDe : article.description);
      updateOrCreateMeta('og:url', canonicalUrl);
      updateOrCreateMeta('og:type', 'article');
      updateOrCreateMeta('og:image', `https://signal-noise.app/blog-images/article-11/social-04-three-things-framework.jpg`);
      updateOrCreateMeta('og:image:width', '1200');
      updateOrCreateMeta('og:image:height', '630');

      // Twitter Card
      updateOrCreateMeta('twitter:card', 'summary_large_image', false);
      updateOrCreateMeta('twitter:title', isGerman ? article.titleDe : article.title, false);
      updateOrCreateMeta('twitter:description', isGerman ? article.descriptionDe : article.description, false);
      updateOrCreateMeta('twitter:image', `https://signal-noise.app/blog-images/article-11/social-04-three-things-framework.jpg`, false);

      // Add hreflang tags for SEO
      const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
      existingHreflang.forEach(tag => tag.remove());

      const hreflangDe = document.createElement('link');
      hreflangDe.rel = 'alternate';
      hreflangDe.hreflang = 'de';
      hreflangDe.href = `${canonicalUrl}?lang=de`;
      document.head.appendChild(hreflangDe);

      const hreflangEn = document.createElement('link');
      hreflangEn.rel = 'alternate';
      hreflangEn.hreflang = 'en';
      hreflangEn.href = canonicalUrl;
      document.head.appendChild(hreflangEn);

      // Enhanced Article structured data
      const structuredData: any = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": isGerman ? article.titleDe : article.title,
        "description": isGerman ? article.descriptionDe : article.description,
        "keywords": article.keywords.join(', '),
        "datePublished": `${article.publishDate}T00:00:00Z`,
        "dateModified": `${article.publishDate}T00:00:00Z`,
        "author": {
          "@type": "Organization",
          "name": "Signal/Noise",
          "url": "https://signal-noise.app"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Signal/Noise",
          "url": "https://signal-noise.app",
          "logo": {
            "@type": "ImageObject",
            "url": "https://signal-noise.app/icon-512.png"
          }
        },
        "image": `https://signal-noise.app/blog-images/article-11/hero-image.jpg`,
        "url": canonicalUrl,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        }
      };

      // Add additional schemas for article-11
      if (slug === 'three-things-productivity') {
        structuredData.wordCount = 5200;
        structuredData.articleBody = "The Three Things Productivity System is a science-backed method for achieving exponential results by focusing on 3 transformational tasks daily instead of 20 maintenance tasks.";
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      script.id = 'article-schema';
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) canonicalTag.remove();
      };
    }
  }, [article, isGerman, slug]);

  if (!article || !canViewArticle) {
    return <Navigate to="/blog" replace />;
  }

  const ArticleComponent = article.component;

  return (
    <>
      {/* Additional SEO schemas for specific articles */}
      <ArticleSchemas slug={slug || ''} />

      <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a', // Softer than pure black
      color: '#e8e8e8', // Softer than pure white
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '2rem'
    }}>
      {/* Preview Mode Indicator */}
      {isPreviewMode && !isArticlePublished && (
        <div style={{
          backgroundColor: '#00ff88',
          color: '#000',
          padding: '0.8rem 1.5rem',
          borderRadius: '6px',
          marginBottom: '2rem',
          fontWeight: '500',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span>📝 Draft Article (Unpublished)</span>
          <a
            href={`/blog${isPreviewMode ? '?preview' : ''}`}
            style={{
              color: '#000',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              fontWeight: '400'
            }}
          >
            Back to all drafts →
          </a>
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        maxWidth: '680px',
        margin: '0 auto 4rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Link to={`/blog${isPreviewMode ? '?preview' : ''}`} style={{
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
    </>
  );
}