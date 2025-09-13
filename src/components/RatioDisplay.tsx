interface RatioDisplayProps {
  ratio: number;
  totalTasks: number;
}

export default function RatioDisplay({ ratio, totalTasks }: RatioDisplayProps) {
  const getRatioClass = () => {
    if (totalTasks === 0) return '';
    if (ratio >= 80) return 'optimal';
    if (ratio >= 60) return 'warning';
    return 'critical';
  };

  const displayText = totalTasks > 0 ? `${ratio}%` : '—';

  return (
    <div className={`ratio-display ${getRatioClass()}`}>
      {displayText}
    </div>
  );
}