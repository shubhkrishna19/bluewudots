import React, { Component } from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // In production: Send to error tracking service (e.g., Sentry)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary glass animate-fade" style={{
                    padding: '48px',
                    textAlign: 'center',
                    margin: '48px auto',
                    maxWidth: '500px',
                    borderRadius: '16px'
                }}>
                    <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>⚠️ Something went wrong</h2>
                    <p className="text-muted" style={{ marginBottom: '24px' }}>
                        An unexpected error occurred. Please try again or contact support if the issue persists.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ textAlign: 'left', marginBottom: '24px', padding: '12px', background: 'var(--bg-accent)', borderRadius: '8px' }}>
                            <summary style={{ cursor: 'pointer', color: 'var(--warning)' }}>Error Details</summary>
                            <pre style={{ fontSize: '0.75rem', overflow: 'auto', marginTop: '12px' }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                    <button
                        className="btn-primary glass-hover"
                        style={{ padding: '12px 32px' }}
                        onClick={this.handleRetry}
                    >
                        🔄 Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
