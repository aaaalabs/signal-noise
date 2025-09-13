import { useState } from 'react';
import { t } from '../i18n/translations';

interface TaskInputProps {
  onAdd: (text: string, type: 'signal' | 'noise') => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [selectedType, setSelectedType] = useState<'signal' | 'noise'>('signal'); // Default to Signal (matches visual hierarchy)

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
    if (e.key === 'Tab' && showButtons) {
      // Switch selection between Signal and Noise
      e.preventDefault();
      setSelectedType(prev => prev === 'signal' ? 'noise' : 'signal');

      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(5);
      }
    } else if (e.key === 'ArrowLeft' && showButtons) {
      // Navigate to Signal
      e.preventDefault();
      setSelectedType('signal');
    } else if (e.key === 'ArrowRight' && showButtons) {
      // Navigate to Noise
      e.preventDefault();
      setSelectedType('noise');
    } else if (e.key === 'Enter' && inputValue.trim()) {
      // Honest behavior: Enter confirms the currently selected type
      if (e.shiftKey) {
        // Shift+Enter forces opposite (power user feature)
        handleAddTask(selectedType === 'signal' ? 'noise' : 'signal');
      } else {
        // Normal Enter confirms selection
        handleAddTask(selectedType);
      }
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
          placeholder={t.inputPlaceholder}
          className="task-input"
          autoComplete="off"
        />
      </div>

      <div className={`decision-buttons ${showButtons ? 'active' : ''}`}>
        <button
          onClick={() => handleAddTask('signal')}
          onMouseEnter={() => setSelectedType('signal')}
          className={`btn btn-signal ${selectedType === 'signal' ? 'selected' : ''}`}
        >
          {t.signalBtn}
        </button>
        <button
          onClick={() => handleAddTask('noise')}
          onMouseEnter={() => setSelectedType('noise')}
          className={`btn btn-noise ${selectedType === 'noise' ? 'selected' : ''}`}
        >
          {t.noiseBtn}
        </button>
      </div>
    </div>
  );
}