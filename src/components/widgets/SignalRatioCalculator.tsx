import { useState } from 'react';

export default function SignalRatioCalculator({ isGerman }: { isGerman: boolean }) {
  const [totalHours, setTotalHours] = useState('8');
  const [signalHours, setSignalHours] = useState('');
  const [ratio, setRatio] = useState<number | null>(null);

  const calculate = () => {
    const total = parseFloat(totalHours);
    const signal = parseFloat(signalHours);
    if (total > 0 && signal >= 0) {
      const calculatedRatio = Math.round((signal / total) * 100);
      setRatio(calculatedRatio);
    }
  };

  const getRatioFeedback = (ratio: number) => {
    if (ratio >= 80) return { text: isGerman ? "Steve Jobs Level! 🎯" : "Steve Jobs Level! 🎯", color: '#00ff88' };
    if (ratio >= 60) return { text: isGerman ? "Gut, aber da geht mehr!" : "Good, but room to improve!", color: '#ffbb33' };
    if (ratio >= 40) return { text: isGerman ? "Zu viel Noise!" : "Too much noise!", color: '#ff8800' };
    return { text: isGerman ? "Kritisch! Fokus verloren." : "Critical! Lost focus.", color: '#ff6b6b' };
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      border: '2px solid #00ff88',
      borderRadius: '12px',
      padding: '2rem',
      margin: '3rem 0',
      textAlign: 'center'
    }}>
      <h3 style={{
        color: '#00ff88',
        fontSize: '1.3rem',
        marginBottom: '1.5rem',
        fontWeight: '400'
      }}>
        {isGerman ? '📊 Berechne dein Signal/Noise Verhältnis' : '📊 Calculate Your Signal/Noise Ratio'}
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <div>
          <label style={{
            display: 'block',
            color: '#b8b8b8',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            textAlign: 'left'
          }}>
            {isGerman ? 'Arbeitsstunden heute:' : 'Hours worked today:'}
          </label>
          <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e8e8e8',
              fontSize: '1rem'
            }}
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            color: '#b8b8b8',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            textAlign: 'left'
          }}>
            {isGerman ? 'Davon Signal-Aufgaben (wichtige Aufgaben):' : 'Signal tasks (important work):'}
          </label>
          <input
            type="number"
            value={signalHours}
            onChange={(e) => setSignalHours(e.target.value)}
            placeholder={isGerman ? "z.B. 5" : "e.g. 5"}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e8e8e8',
              fontSize: '1rem'
            }}
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <button
          onClick={calculate}
          style={{
            backgroundColor: '#00ff88',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00cc6a';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00ff88';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isGerman ? 'Berechnen' : 'Calculate'}
        </button>
      </div>

      {ratio !== null && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#0a0a0a',
          borderRadius: '8px',
          border: `2px solid ${getRatioFeedback(ratio).color}`
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: '100',
            color: getRatioFeedback(ratio).color,
            marginBottom: '0.5rem'
          }}>
            {ratio}%
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: getRatioFeedback(ratio).color,
            fontWeight: '400'
          }}>
            {getRatioFeedback(ratio).text}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#888',
            marginTop: '1rem',
            lineHeight: '1.5'
          }}>
            {ratio < 80 && (
              isGerman
                ? `Ziel: 80% Signal wie Steve Jobs. Dir fehlen noch ${80 - ratio}%.`
                : `Target: 80% signal like Steve Jobs. You need ${80 - ratio}% more.`
            )}
            {ratio >= 80 && ratio < 100 && (
              isGerman
                ? "Exzellent! Du arbeitest auf Steve Jobs Niveau."
                : "Excellent! You're working at Steve Jobs level."
            )}
            {ratio === 100 && (
              isGerman
                ? "100% Signal! Du bist im Elon Musk Modus!"
                : "100% Signal! You're in Elon Musk mode!"
            )}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#888',
        lineHeight: '1.5'
      }}>
        <strong style={{ color: '#00ff88' }}>
          {isGerman ? 'Signal = ' : 'Signal = '}
        </strong>
        {isGerman
          ? 'Aufgaben die dich direkt zu deinen Zielen bringen'
          : 'Tasks that directly advance your goals'}
        <br />
        <strong style={{ color: '#ff6b6b', marginTop: '0.5rem', display: 'inline-block' }}>
          {isGerman ? 'Noise = ' : 'Noise = '}
        </strong>
        {isGerman
          ? 'Alles andere (Meetings, E-Mails, Ablenkungen)'
          : 'Everything else (meetings, emails, distractions)'}
      </div>
    </div>
  );
}