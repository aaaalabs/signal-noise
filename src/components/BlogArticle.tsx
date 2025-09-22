import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

// Import individual article components
import SteveJobsArticle from './articles/SteveJobsArticle';
import SeventyFivePercentArticle from './articles/SeventyFivePercentArticle';
import ElonMuskArticle from './articles/ElonMuskArticle';

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