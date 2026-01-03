import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import errorHandler from '../../services/errorHandlerService'

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * Integrates with errorHandlerService for error logging and recovery suggestions
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryHints: [],
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error using errorHandlerService
    const errorId = errorHandler.logError(error, {
      componentStack: errorInfo.componentStack,
      context: 'React Component Error',
    })

    this.setState({
      error,
      errorInfo,
      recoveryHints: errorHandler.getRecoveryHints(errorId),
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryHints: [],
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white text-center mb-3">Something went wrong</h1>
            <p className="text-slate-300 text-center text-sm mb-6">
              {this.state.error && this.state.error.toString()}
            </p>

            {/* Recovery Hints */}
            {this.state.recoveryHints.length > 0 && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-blue-300 font-semibold text-sm mb-2">Try this:</h3>
                <ul className="space-y-1">
                  {this.state.recoveryHints.map((hint, idx) => (
                    <li key={idx} className="text-blue-200 text-xs flex items-start">
                      <span className="mr-2">•</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error Details (Dev Mode) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 cursor-pointer">
                <summary className="text-slate-400 text-xs hover:text-slate-300 mb-2">
                  Error details
                </summary>
                <pre className="bg-slate-900/50 p-3 rounded text-xs text-slate-300 overflow-auto max-h-32 font-mono text-red-300">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Reset Button */}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
