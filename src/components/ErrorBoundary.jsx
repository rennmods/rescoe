import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error ke Supabase (opsional)
    console.error('Error Boundary Caught:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-purple-900/20 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 shadow-2xl">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400" size={40} />
            </div>
            
            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-3">
              Oops! Something went wrong 🫣
            </h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Jangan panik! Tim developer sudah diberitahu. Coba refresh halaman atau kembali ke home.
            </p>

            {/* Error Details (Dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-900/50 rounded-lg p-4 mb-6 text-sm text-gray-300">
                <summary className="cursor-pointer font-medium mb-2">Error Details (Dev)</summary>
                <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex-1"
              >
                <RefreshCw size={18} />
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex-1"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>

            {/* Funny Message */}
            <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                💡 <strong>Pro tip:</strong> Jika error berlanjut, coba kirim screenshot ke admin!
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
