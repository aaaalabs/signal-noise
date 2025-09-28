import React, { useState } from 'react';
import './Demo.css';

interface Task {
  text: string;
  correct: 'signal' | 'noise';
}

const Demo: React.FC = () => {
  const [currentState, setCurrentState] = useState(1);
  const [signalCount, setSignalCount] = useState(3);
  const [totalTasks, setTotalTasks] = useState(6);
  const [currentTaskIndex] = useState(0);
  const [lastChoiceWasCorrect, setLastChoiceWasCorrect] = useState(true);

  const tasks: Task[] = [
    { text: "Browse social media for 30 minutes", correct: "noise" },
    { text: "Call your biggest potential client", correct: "signal" },
    { text: "Reorganize your desk drawer", correct: "noise" },
    { text: "Review this quarter's revenue strategy", correct: "signal" }
  ];

  const maxState = 4;

  const nextState = () => {
    if (currentState < maxState) {
      setCurrentState(currentState + 1);
    }
  };

  const makeChoice = (choice: 'signal' | 'noise') => {
    const task = tasks[currentTaskIndex];
    const isCorrectChoice = choice === task.correct;
    setLastChoiceWasCorrect(isCorrectChoice);

    if (isCorrectChoice) {
      // Reward correct choices - this teaches the methodology
      if (choice === 'signal') {
        setSignalCount(signalCount + 1);
      }
      setTotalTasks(totalTasks + 1);
    } else {
      // Consequence for wrong choices - but still count the task
      if (choice === 'signal') {
        // Wrong Signal choice hurts ratio more
        setSignalCount(signalCount + 1);
        setTotalTasks(totalTasks + 2); // Penalty: count as if 2 tasks added
      } else {
        // Wrong Noise choice
        setTotalTasks(totalTasks + 1);
        // Signal count stays same, so ratio drops
      }
    }

    // Clean transition to ratio revelation
    setTimeout(() => {
      nextState();
    }, 800);
  };

  const calculateRatio = () => {
    return Math.round((signalCount / totalTasks) * 100);
  };

  const calculateImprovement = () => {
    const newRatio = calculateRatio();
    const improvement = newRatio - 47;

    if (improvement > 0) {
      return `+${improvement}% improvement`;
    } else if (improvement < 0) {
      return `${improvement}% decline`;
    } else {
      return "No change";
    }
  };

  return (
    <div className="demo-wrapper">
      <div className="demo-container">
      {/* State 1: Introduction */}
      <div className={`demo-state ${currentState === 1 ? 'active' : ''}`}>
        <div className="logo">Signal/Noise</div>
        <div className="methodology-intro">
          Steve Jobs classified every task as either<br />
          <strong>Signal</strong> or <strong>Noise</strong>
        </div>
        <button className="start-button" onClick={nextState}>
          Experience It
        </button>
      </div>

      {/* State 2: The Choice */}
      <div className={`demo-state ${currentState === 2 ? 'active' : ''}`}>
        <div className="task-presentation">
          <div className="task-label">Your Task</div>
          <div className="task-text">{tasks[currentTaskIndex]?.text}</div>
          <div className="methodology-hint">
            Does this move your most important goals forward?
          </div>
        </div>
        <div className="binary-choice">
          <button
            className="choice-button signal-choice"
            onClick={() => makeChoice('signal')}
          >
            Signal
          </button>
          <button
            className="choice-button noise-choice"
            onClick={() => makeChoice('noise')}
          >
            Noise
          </button>
        </div>
      </div>

      {/* State 3: Ratio Revelation */}
      <div className={`demo-state ${currentState === 3 ? 'active' : ''}`}>
        <div className="ratio-reveal">
          <div className="ratio-label">Your Signal Ratio</div>
          <div className="ratio-number">{calculateRatio()}%</div>
          <div className="ratio-improvement">{calculateImprovement()}</div>
          <div className="educational-message">
            {lastChoiceWasCorrect
              ? "✓ Perfect! That's how Jobs would classify it."
              : "Think again: Does browsing social media drive your biggest goals?"}
          </div>
        </div>
        <button className="continue-button" onClick={nextState}>
          Continue
        </button>
      </div>

      {/* State 4: Full Experience */}
      <div className={`demo-state ${currentState === 4 ? 'active' : ''}`}>
        <div className="experience-grid">
          <div className="feature-card">
            <div className="feature-title">Real-Time Tracking</div>
            <div className="feature-description">
              See your Signal ratio update instantly with each decision
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">Achievement System</div>
            <div className="feature-description">
              Build streaks and unlock productivity insights
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-title">AI Coach (Beta)</div>
            <div className="feature-description">
              Personalized methodology guidance based on your patterns
            </div>
          </div>
        </div>
        <a
          href="/app"
          className="cta-final"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
          }}
        >
          Try Beta App
        </a>
      </div>
      </div>
    </div>
  );
};

export default Demo;