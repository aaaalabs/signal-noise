import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import type { Task } from '../types';

interface TaskInputProps {
  onAdd: (text: string, type: 'signal' | 'noise') => void;
  todaySignalCount: number;
  tasks: Task[];
}

export default function TaskInput({ onAdd, todaySignalCount, tasks }: TaskInputProps) {
  const t = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [selectedType, setSelectedType] = useState<'signal' | 'noise'>('signal'); // Default to Signal (matches visual hierarchy)
  const [suggestion, setSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find best matching previous task for autocomplete
  const findSuggestion = (input: string): string => {
    if (input.length < 2) return '';

    // Sort tasks by recency and get unique texts
    const recentTexts = tasks
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(t => t.text);
    const uniqueTexts = [...new Set(recentTexts)];

    // Find first match (case-insensitive prefix)
    return uniqueTexts.find(text =>
      text.toLowerCase().startsWith(input.toLowerCase())
    ) || '';
  };

  // Update lock state when signal count changes
  useEffect(() => {
    setIsLocked(todaySignalCount >= 8);
  }, [todaySignalCount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowButtons(value.trim().length > 0 && !isLocked);

    // Update suggestion
    const newSuggestion = findSuggestion(value);
    setSuggestion(newSuggestion);
    setShowSuggestion(true); // Show suggestion when typing

    // No need to reset tab count anymore since we removed the counter
  };

  const handleAddTask = (type: 'signal' | 'noise') => {
    if (inputValue.trim()) {
      onAdd(inputValue, type);
      setInputValue('');
      setShowButtons(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      if (suggestion && showSuggestion && inputValue.length >= 2) {
        // Accept autocomplete
        setInputValue(suggestion);
        setShowSuggestion(false); // Hide suggestion after acceptance
        setShowButtons(!isLocked); // Show buttons if not locked

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(5);
        }
      } else if (showButtons) {
        // Switch selection with single Tab
        setSelectedType(prev => prev === 'signal' ? 'noise' : 'signal');

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(5);
        }
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

  // Handle click on locked input
  const handleInputClick = () => {
    if (isLocked && inputRef.current) {
      // Trigger shake animation
      inputRef.current.classList.add('shake-locked');
      setTimeout(() => {
        inputRef.current?.classList.remove('shake-locked');
      }, 300);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  return (
    <div className="input-section">
      <div className="input-wrapper" style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
          placeholder={isLocked
            ? "8 signals reached today. Move some to noise first."
            : t.inputPlaceholder
          }
          className={`task-input ${isLocked ? 'input-locked' : ''}`}
          disabled={isLocked}
          autoComplete="off"
        />
        {/* Autocomplete suggestion overlay - Full word */}
        {suggestion && showSuggestion && inputValue.length >= 2 && !isLocked && (
          <div
            className="suggestion-overlay"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 159, 10, 0.08)',
              border: '1px solid rgba(255, 159, 10, 0.3)',
              borderRadius: '6px',
              color: '#ff9f0a',
              opacity: 0.8,
              pointerEvents: 'none',
              fontWeight: 100,
              transition: 'opacity 0.2s ease',
              fontSize: '14px',
              maxWidth: '60%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {suggestion}
          </div>
        )}
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