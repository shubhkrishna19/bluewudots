import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree and displays fallback UI.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });

        // Log to console in development
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);

        // Future: Send to error tracking service (Sentry, etc.)
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
                    padding: '40px'
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '48px',
                        maxWidth: '500px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            fontSize: '2.5rem'
                        }}>
                            ⚠️
                        </div>

                        <h1 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.5rem' }}>
                            Something went wrong
                        </h1>

                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: '1.6' }}>
                            An unexpected error occurred. Our team has been notified.
                            Please try refreshing the page.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{
                                marginBottom: '24px',
                                textAlign: 'left',
                                background: 'rgba(0,0,0,0.3)',
                                padding: '16px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                color: 'rgba(255,255,255,0.5)'
                            }}>
                                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                                    Error Details (Dev Only)
                                </summary>
                                <pre style={{ overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={this.handleReload}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={this.handleReset}
                                style={{
                                    padding: '12px 24px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Try Again
                            </button>
                        </div>

                        <p style={{
                            marginTop: '32px',
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.3)'
                        }}>
                            Bluewud OTS v2.0 • Error ID: {Date.now().toString(36).toUpperCase()}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
