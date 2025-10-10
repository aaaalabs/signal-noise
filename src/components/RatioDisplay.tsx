import { useState } from 'react';
import { vibrate } from '../utils/haptics';
import type { AppData } from '../types';
import AchievementDots from './AchievementDots';
import { checkPremiumStatus } from '../services/premiumService';
import { syncSuccess, syncError, syncIdle, syncChecking, syncReceiving } from '../services/syncService';
import { getTodayRatio } from '../utils/achievements';

interface RatioDisplayProps {
  ratio: number;
  totalTasks: number;
  data: AppData;
  earnedCount: number;
  hasAchievement?: boolean;
  onDataUpdate?: (newData: AppData) => void;

export default function RatioDisplay({ ratio, totalTasks, data, earnedCount, hasAchievement, onDataUpdate }: RatioDisplayProps) {
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = async () => {
    const premiumStatus = checkPremiumStatus();

    if (!premiumStatus.isActive) {
      // Subtle haptic feedback for non-premium users
      vibrate(5);

      return;

    if (isManualSyncing) return; // Prevent double-tap

    setIsManualSyncing(true);

    try {
      console.log('Manual sync triggered via ratio tap...');

      // Show checking animation
      syncChecking();

      const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
      if (!sessionData.sessionToken) {
        syncError();
        return;

      // Check cloud metadata
      const response = await fetch('/api/sync-meta', {
        headers: {
          'Authorization': `Bearer ${sessionData.sessionToken}`
      });

      if (response.ok) {
        const metadata = await response.json();

        console.log('📊 Manual sync metadata:', {
          cloudVersion: metadata.version,
          lastDevice: metadata.lastDevice,
          lastModified: new Date(metadata.lastModified).toISOString()
        });

        // Always pull latest data on manual sync
        syncReceiving();

        const dataResponse = await fetch('/api/tasks', {
          headers: {
            'Authorization': `Bearer ${sessionData.sessionToken}`
        });

        if (dataResponse.ok) {
          const { data: cloudData } = await dataResponse.json();

          // Migrate cloud data if needed
          if (!cloudData.badges) cloudData.badges = [];
          if (!cloudData.patterns) cloudData.patterns = {};
          if (!cloudData.settings) cloudData.settings = { targetRatio: 80, notifications: false };
          if (cloudData.signal_ratio === undefined) cloudData.signal_ratio = getTodayRatio(cloudData.tasks || []);

          console.log('Manual sync completed:', {
            taskCount: cloudData.tasks?.length || 0,
            fromDevice: metadata.lastDevice
          });

          // Update parent component with new data
          if (onDataUpdate) {
            onDataUpdate(cloudData);

          syncSuccess();

          // Haptic feedback for success
          vibrate(5);
            vibrate(10);
        } else {
          console.error('❌ Manual sync failed to fetch data');
          syncError();
      } else {
        console.error('❌ Manual sync failed to get metadata');
        syncError();
    } catch (error) {
      console.error('❌ Manual sync error:', error);
      syncError();
    } finally {
      setIsManualSyncing(false);
      // Return to idle after 2 seconds
      setTimeout(() => syncIdle(), 2000);
  };

  const getRatioClass = () => {
    if (totalTasks === 0) return '';

    // Context-aware colors: Only show red when user actually made poor choices
    const today = new Date().toDateString();
    const todayTasks = data.tasks.filter(task =>
      new Date(task.timestamp).toDateString() === today
    );
    const noiseTasksToday = todayTasks.filter(task => task.type === 'noise').length;

    // If no noise tasks chosen yet → contextual colors based on signal progress
    if (noiseTasksToday === 0) {
      if (ratio >= 80) return 'optimal';   // Green - reward good choices even without noise
      if (ratio >= 50) return 'warning';   // Orange - encourage progress at 50%+
      return 'neutral';                    // Grey - starting state, no punishment

    // Standard ratio colors when actual choices between signal/noise were made
    if (ratio >= 80) return 'optimal';   // Green
    if (ratio >= 60) return 'warning';   // Orange
    return 'critical';                   // Red (honest poor performance)
  };

  const displayText = totalTasks > 0 ? `${ratio}%` : '—';

  // Calculate progress ring
  const circumference = 628; // 2 * PI * 100
  const progress = totalTasks > 0 ? ratio : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="ratio-container" style={{ position: 'relative' }}>
      {/* Progress Ring Background */}
      <svg
        className="progress-ring"
        width="200"
        height="200"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <circle
          className="progress-ring-circle"
          cx="100"
          cy="100"
          r="100"
          fill="none"
          stroke="rgba(0, 255, 136, 0.05)"
          strokeWidth="1"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        />
      </svg>

      {/* Ratio Display */}
      <div
        className={`ratio-display ${getRatioClass()} ${hasAchievement ? 'has-achievement' : ''}`}
        style={{
          position: 'relative',
          zIndex: 1,
          cursor: checkPremiumStatus().isActive ? 'pointer' : 'default',
          userSelect: 'none'
        }}
        onClick={handleManualSync}
        title={checkPremiumStatus().isActive ? 'Tap to sync' : undefined}
      >
        {displayText}
      </div>

      {/* Achievement Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '-65px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <AchievementDots
          data={data}
          earnedCount={earnedCount}
        />
      </div>
    </div>
  );
