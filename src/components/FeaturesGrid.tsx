import { useTranslation } from '../contexts/LanguageContext';

interface Feature {
  icon: string;
  key: 'simple' | 'private' | 'focused';
}

const features: Feature[] = [
  {
    icon: '⚡',
    key: 'simple'
  },
  {
    icon: '🔒',
    key: 'private'
  },
  {
    icon: '🎯',
    key: 'focused'
  }
];

export default function FeaturesGrid() {
  const t = useTranslation();

  return (
    <section style={{
      padding: '60px 20px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '32px',
        marginBottom: '20px'
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              padding: '24px 16px'
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              filter: 'grayscale(0.3)',
              opacity: 0.9
            }}>
              {feature.icon}
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#fff',
              marginBottom: '12px',
              letterSpacing: '0.02em'
            }}>
              {t.features?.[feature.key]?.title || 'Feature'}
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: 100,
              color: '#888',
              lineHeight: 1.6,
              margin: 0
            }}>
              {t.features?.[feature.key]?.description || 'Description'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
