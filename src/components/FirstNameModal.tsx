import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface FirstNameModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function FirstNameModal({ show, onClose, onSave }: FirstNameModalProps) {
  const t = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [isValid, setIsValid] = useState(true);

  if (!show) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    setIsValid(value.trim().length > 0);
  };

  const handleSave = () => {
    const trimmedName = firstName.trim();
    if (!trimmedName) {
      setIsValid(false);
      return;
    }

    onSave(trimmedName);
    onClose();
    setFirstName('');
    setIsValid(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setFirstName('');
    setIsValid(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(8px)'
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '380px',
          width: '90%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '8px'
          }}
        >
          {t.namePrompt.split('(')[0].replace('?', '').trim()}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '14px',
            color: '#999',
            marginBottom: '32px',
            lineHeight: 1.5
          }}
        >
          {t.namePrompt.match(/\((.*?)\)/)?.[1] || 'For personalized coaching'}
        </p>

        {/* Name Input */}
        <input
          type="text"
          value={firstName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder="Your first name"
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            background: '#000',
            border: `2px solid ${isValid ? '#333' : '#ff4444'}`,
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '8px',
            fontFamily: 'inherit',
            outline: 'none'
          }}
        />

        {!isValid && (
          <p style={{
            color: '#ff4444',
            fontSize: '12px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            Please enter your first name
          </p>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: isValid ? '32px' : '24px'
        }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 400,
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#999',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#666';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#999';
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!firstName.trim()}
            style={{
              flex: 1,
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 500,
              background: firstName.trim() ? 'var(--signal)' : '#333',
              border: 'none',
              borderRadius: '8px',
              color: firstName.trim() ? '#000' : '#666',
              cursor: firstName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}