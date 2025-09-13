import { useState } from 'react';

interface TaskInputProps {
  onAdd: (text: string, type: 'signal' | 'noise') => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showButtons, setShowButtons] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowButtons(value.trim().length > 0);
  };

  const handleAddTask = (type: 'signal' | 'noise') => {
    if (inputValue.trim()) {
      onAdd(inputValue, type);
      setInputValue('');
      setShowButtons(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      // Auto-classify based on keywords
      const text = inputValue.toLowerCase();
      const signalKeywords = ['wichtig', 'deadline', 'kunde', 'projekt', 'launch', 'meeting'];
      const isSignal = signalKeywords.some(keyword => text.includes(keyword));
      handleAddTask(isSignal ? 'signal' : 'noise');
    }
  };

  return (
    <div className="input-section">
      <div className="input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Was steht an?"
          className="task-input"
          autoComplete="off"
        />
      </div>

      <div className={`decision-buttons ${showButtons ? 'active' : ''}`}>
        <button
          onClick={() => handleAddTask('signal')}
          className="btn btn-signal"
        >
          Signal ✓
        </button>
        <button
          onClick={() => handleAddTask('noise')}
          className="btn btn-noise"
        >
          Noise ✗
        </button>
      </div>
    </div>
  );
}