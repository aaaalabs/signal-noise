import type { Task } from '../types';
import { generatePatternInsights } from '../utils/patternAnalysis';

interface PatternInsightsProps {
  tasks: Task[];
}

export default function PatternInsights({ tasks }: PatternInsightsProps) {
  const insights = generatePatternInsights(tasks);

  // When no insights, show nothing - emptiness is the message
  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="pattern-insights">
      <div className="pattern-message">
        {insights.map((insight, index) => (
          <span key={index}>
            {index > 0 && <span> • </span>}
            <span
              className={`insight-${insight.type}`}
              dangerouslySetInnerHTML={{ __html: insight.message }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}