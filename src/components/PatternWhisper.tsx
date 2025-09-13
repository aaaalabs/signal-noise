import { useEffect, useState } from 'react';

interface PatternWhisperProps {
  message: string;
  show: boolean;
}

export default function PatternWhisper({ message, show }: PatternWhisperProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, message]);

  return (
    <div
      className={`pattern-whisper ${visible ? 'show' : ''}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '12px',
        color: '#555',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
        pointerEvents: 'none',
        zIndex: 100
      }}
    >
      {message}
    </div>
  );
}