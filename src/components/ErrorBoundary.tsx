import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Jony Ive approved error screen
      return this.props.fallback || (
        <div className="min-h-screen bg-black text-white flex items-center justify-center antialiased">
          <div className="max-w-sm mx-auto px-8 py-12 text-center">
            <h1 className="text-2xl font-light mb-8 tracking-tight">
              Signal/Noise
            </h1>

            <div className="mb-8">
              <div className="text-sm text-gray-400 font-light tracking-wide mb-4">
                Something went wrong
              </div>
              <button
                onClick={() => window.location.reload()}
                className="border border-gray-800 px-6 py-3 text-sm font-light tracking-wide
                           hover:bg-gray-900 hover:border-gray-700 transition-all duration-300
                           rounded-none"
              >
                Reload
              </button>
            </div>

            <div className="text-xs text-gray-600 font-light tracking-wide">
              The error has been logged
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;