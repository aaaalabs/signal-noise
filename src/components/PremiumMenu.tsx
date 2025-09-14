import { useEffect, useRef } from 'react';
import type { Task } from '../types';
import { calculateStreak } from '../utils/achievements';
import { deactivatePremium } from '../services/premiumService';

interface PremiumMenuProps {
  show: boolean;
  onClose: () => void;
  email: string;
  tier: string;
  tasks: Task[];
  currentRatio: number;
  totalTasks: number;
}

export default function PremiumMenu({
  show,
  onClose,
  email,
  tier,
  tasks,
  currentRatio,
  totalTasks
}: PremiumMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const streak = calculateStreak(tasks);

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  const handleSignOut = () => {
    deactivatePremium();
    onClose();
    // Refresh to update the UI
    window.location.reload();
  };

  const handleExportData = () => {
    onClose();
    // Trigger the same export function used by Cmd+E
    import('../services/syncService').then(({ exportData }) => {
      exportData();
    });
  };

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: '0',
        marginTop: '8px',
        minWidth: '220px',
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        zIndex: 9999,
        padding: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '13px',
        animation: 'fadeIn 0.2s ease-out',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Identity Section */}
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #222' }}>
        <div style={{ color: '#999', fontSize: '11px', marginBottom: '2px', fontWeight: 300 }}>
          {email}
        </div>
        <div style={{ color: '#fff', fontSize: '12px', fontWeight: 400 }}>
          {tier === 'foundation' ? 'Foundation Member' : 'Early Adopter'}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ color: '#999', fontWeight: 300 }}>Streak</span>
          <span style={{ color: '#fff', fontWeight: 400 }}>{streak} days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ color: '#999', fontWeight: 300 }}>Today's Ratio</span>
          <span style={{
            color: currentRatio >= 80 ? 'var(--signal)' : currentRatio >= 50 ? '#ff9f0a' : '#666',
            fontWeight: 400
          }}>
            {currentRatio}%
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#999', fontWeight: 300 }}>Tasks Today</span>
          <span style={{ color: '#fff', fontWeight: 400 }}>{totalTasks}</span>
        </div>
      </div>

      {/* Actions Section */}
      <div>
        <button
          onClick={handleExportData}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ccc',
            fontSize: '12px',
            fontWeight: 300,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '4px',
            marginBottom: '4px',
            transition: 'all 0.15s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ccc';
          }}
        >
          <span>Export Data</span>
          <span style={{ fontSize: '10px', color: '#666' }}>⌘E</span>
        </button>

        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ccc',
            fontSize: '12px',
            fontWeight: 300,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ccc';
          }}
        >
          Sign Out
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}