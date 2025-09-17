/**
 * Signal Wave Widget React Integration
 *
 * Handles communication between React app and Signal Wave Android widget
 * Design Principle: Seamless, transparent data flow
 */

interface SignalWaveData {
  currentRatio: number;
  dailyStreak: number;
  totalSignal: number;
  totalNoise: number;
  isPremium: boolean;
  patterns?: {
    hourlyAverage: number[];
    bestHour: number;
    worstHour: number;
  };
  aiInsight?: string;
}

interface AndroidSignalWave {
  updateWidgetData: (jsonData: string) => void;
  updateAIInsight: (insight: string, confidence: number) => void;
}

declare global {
  interface Window {
    AndroidSignalWave?: AndroidSignalWave;
  }
}

/**
 * Signal Wave Widget Manager
 * Manages all interactions with the Signal Wave Android widget
 */
export class SignalWaveWidgetManager {
  private static instance: SignalWaveWidgetManager;
  private updateThrottle: NodeJS.Timeout | null = null;
  private lastUpdate: number = 0;
  private readonly MIN_UPDATE_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.initializeWidgetCommunication();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SignalWaveWidgetManager {
    if (!SignalWaveWidgetManager.instance) {
      SignalWaveWidgetManager.instance = new SignalWaveWidgetManager();
    }
    return SignalWaveWidgetManager.instance;
  }

  /**
   * Initialize widget communication channel
   */
  private initializeWidgetCommunication(): void {
    // Check if we're in Android TWA environment
    if (!this.isAndroidEnvironment()) {
      console.log('Signal Wave: Not in Android environment, widget updates disabled');
      return;
    }

    console.log('Signal Wave: Widget communication initialized');

    // Set up periodic sync for premium users
    this.setupPeriodicSync();
  }

  /**
   * Check if running in Android TWA
   */
  private isAndroidEnvironment(): boolean {
    return typeof window.AndroidSignalWave !== 'undefined';
  }

  /**
   * Update widget with current app data
   */
  public updateWidget(data: SignalWaveData): void {
    if (!this.isAndroidEnvironment()) {
      return;
    }

    // Throttle updates to preserve battery
    if (!this.shouldUpdate()) {
      this.scheduleUpdate(data);
      return;
    }

    try {
      const jsonData = JSON.stringify(data);
      window.AndroidSignalWave!.updateWidgetData(jsonData);

      this.lastUpdate = Date.now();
      console.log('Signal Wave: Widget updated', data.currentRatio);
    } catch (error) {
      console.error('Signal Wave: Failed to update widget', error);
    }
  }

  /**
   * Update AI insight for premium users
   */
  public updateAIInsight(insight: string, confidence: number = 0.9): void {
    if (!this.isAndroidEnvironment()) {
      return;
    }

    if (!insight || insight.length === 0) {
      return;
    }

    try {
      window.AndroidSignalWave!.updateAIInsight(insight, Math.round(confidence * 100));
      console.log('Signal Wave: AI insight updated');
    } catch (error) {
      console.error('Signal Wave: Failed to update AI insight', error);
    }
  }

  /**
   * Check if update should proceed based on throttling
   */
  private shouldUpdate(): boolean {
    const now = Date.now();
    return now - this.lastUpdate >= this.MIN_UPDATE_INTERVAL;
  }

  /**
   * Schedule a delayed update
   */
  private scheduleUpdate(data: SignalWaveData): void {
    if (this.updateThrottle) {
      clearTimeout(this.updateThrottle);
    }

    const delay = this.MIN_UPDATE_INTERVAL - (Date.now() - this.lastUpdate);

    this.updateThrottle = setTimeout(() => {
      this.updateWidget(data);
    }, Math.max(0, delay));
  }

  /**
   * Set up periodic sync for premium users
   */
  private setupPeriodicSync(): void {
    // Sync every 5 minutes for premium users
    setInterval(() => {
      const data = this.gatherCurrentData();
      if (data?.isPremium) {
        this.syncPremiumFeatures(data);
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Gather current app data for widget
   */
  private gatherCurrentData(): SignalWaveData | null {
    // This would be implemented in the main app to gather actual data
    // For now, return null to indicate data should be provided externally
    return null;
  }

  /**
   * Sync premium features like AI insights
   */
  private syncPremiumFeatures(data: SignalWaveData): void {
    // This would fetch AI insights and pattern analysis
    console.log('Signal Wave: Syncing premium features');
  }

  /**
   * Generate hourly pattern data for visualization
   */
  public generatePatternData(tasks: any[]): number[] {
    const hourlyData = new Array(24).fill(0);
    const hourlyCounts = new Array(24).fill(0);

    tasks.forEach(task => {
      const hour = new Date(task.timestamp).getHours();
      if (task.type === 'signal') {
        hourlyData[hour]++;
      }
      hourlyCounts[hour]++;
    });

    // Calculate ratios
    return hourlyData.map((signalCount, hour) => {
      const total = hourlyCounts[hour];
      return total > 0 ? Math.round((signalCount / total) * 100) : 50;
    });
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.updateThrottle) {
      clearTimeout(this.updateThrottle);
      this.updateThrottle = null;
    }
  }
}

// Export singleton instance
export const signalWaveWidget = SignalWaveWidgetManager.getInstance();