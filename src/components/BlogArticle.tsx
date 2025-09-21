import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

// Import individual article components
import SteveJobsArticle from './articles/SteveJobsArticle';

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
  }
  // Additional articles will be added here
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const isGerman = currentLanguage === 'de';

  const article = slug ? articles[slug] : null;

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

  if (!article) {
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