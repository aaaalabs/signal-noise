import { Link } from 'react-router-dom';

interface ArticleInfo {
  slug: string;
  title: string;
  titleDe?: string;
}

interface ArticleNavigationProps {
  previousArticle?: ArticleInfo;
  nextArticle?: ArticleInfo;
  isGerman: boolean;
}

export default function ArticleNavigation({ previousArticle, nextArticle, isGerman }: ArticleNavigationProps) {
  // Don't render if no navigation options available
  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <>
      {/* Separator line - honest division without decoration */}
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: '#333',
        margin: '4rem 0 2rem',
        maxWidth: '200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }} />

      {/* Navigation Container - Jony Ive: Beautiful restraint */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem', /* Generous spacing for comfortable interaction */
        margin: '2rem 0 4rem',
        padding: '0 2rem',
        flexWrap: 'wrap' /* Mobile responsiveness */
      }}>

        {/* Previous Article */}
        {previousArticle ? (
          <Link
            to={`/blog/${previousArticle.slug}`}
            style={{
              textDecoration: 'none',
              color: '#666666', /* Subtle, non-competing color */
              fontSize: '0.9rem',
              fontWeight: '300',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s ease',
              padding: '0.5rem', /* Comfortable touch target */
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00ff88'; /* Signal green hover */
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666666';
            }}
          >
            <span style={{ fontSize: '1rem' }}>←</span>
            <span>
              {isGerman && previousArticle.titleDe ? previousArticle.titleDe : previousArticle.title}
            </span>
          </Link>
        ) : (
          <div style={{
            width: '200px' /* Maintain spacing even when no previous article */
          }} />
        )}

        {/* Separator - only if both articles exist */}
        {previousArticle && nextArticle && (
          <div style={{
            color: '#333333',
            fontSize: '0.8rem',
            fontWeight: '100',
            userSelect: 'none'
          }}>
            |
          </div>
        )}

        {/* Next Article */}
        {nextArticle ? (
          <Link
            to={`/blog/${nextArticle.slug}`}
            style={{
              textDecoration: 'none',
              color: '#666666',
              fontSize: '0.9rem',
              fontWeight: '300',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.2s ease',
              padding: '0.5rem',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00ff88';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666666';
            }}
          >
            <span>
              {isGerman && nextArticle.titleDe ? nextArticle.titleDe : nextArticle.title}
            </span>
            <span style={{ fontSize: '1rem' }}>→</span>
          </Link>
        ) : (
          <div style={{
            width: '200px' /* Maintain spacing even when no next article */
          }} />
        )}
      </div>

      {/* Mobile responsive styling handled via inline media queries */}
    </>
  );
}