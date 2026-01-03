/**
 * TwoFactorAuth.jsx
 * Two-Factor Authentication component for secure user access
 * Supports OTP via email/SMS, verification, and account recovery
 */

import React, { useState } from 'react'

const TwoFactorAuth = ({ userId, onVerificationSuccess, onCancel, method = 'email' }) => {
  const [step, setStep] = useState('method') // 'method', 'sending', 'verifying', 'success'
  const [selectedMethod, setSelectedMethod] = useState(method)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [attempts, setAttempts] = useState(3)

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Start timer
  React.useEffect(() => {
    if (step === 'verifying' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, step])

  // Handle method selection
  const handleMethodSelect = async (chosenMethod) => {
    setSelectedMethod(chosenMethod)
    setIsLoading(true)
    setError('')

    try {
      // Call backend API to initiate 2FA
      const response = await fetch('/api/security/2fa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, method: chosenMethod }),
      })

      if (!response.ok) throw new Error('Failed to initiate 2FA')

      setStep('verifying')
      setSuccessMessage(`OTP sent via ${chosenMethod}`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Error initiating 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP submission
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('OTP must be 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/security/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp }),
      })

      if (!response.ok) {
        const remaining = attempts - 1
        setAttempts(remaining)
        if (remaining <= 0) {
          setError('Too many failed attempts. Please try again later.')
          setStep('method')
        } else {
          setError(`Invalid OTP. ${remaining} attempts remaining.`)
        }
        return
      }

      setStep('success')
      setSuccessMessage('2FA verification successful!')
      setTimeout(() => onVerificationSuccess?.(), 2000)
    } catch (err) {
      setError(err.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP input with auto-submit
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
    if (value.length === 6) {
      // Auto-submit when 6 digits entered
      setTimeout(handleVerifyOTP, 100)
    }
  }

  return (
    <div className="two-factor-auth glass">
      <h2>Two-Factor Authentication</h2>

      {/* Method Selection */}
      {step === 'method' && (
        <div className="auth-step">
          <p>Choose your verification method:</p>
          <div className="method-options">
            <button
              className={`method-btn glass-hover ${selectedMethod === 'email' ? 'active' : ''}`}
              onClick={() => handleMethodSelect('email')}
              disabled={isLoading}
            >
              📧 Email
            </button>
            <button
              className={`method-btn glass-hover ${selectedMethod === 'sms' ? 'active' : ''}`}
              onClick={() => handleMethodSelect('sms')}
              disabled={isLoading}
            >
              📱 SMS
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification */}
      {step === 'verifying' && (
        <div className="auth-step">
          <p>Enter the verification code sent to your {selectedMethod}:</p>
          <div className="otp-input-group">
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              className="otp-input"
              disabled={isLoading}
              autoFocus
            />
            <span className="time-remaining">{formatTime(timeRemaining)}</span>
          </div>
          <p className="attempts-left">Attempts remaining: {attempts}</p>
          {!isLoading && (
            <button className="resend-btn" onClick={() => handleMethodSelect(selectedMethod)}>
              Resend OTP
            </button>
          )}
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="auth-step success">
          <div className="success-icon">✓</div>
          <p>Verification successful!</p>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Action Buttons */}
      {step !== 'success' && (
        <div className="auth-actions">
          <button className="cancel-btn" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      )}

      <style>{`
        .two-factor-auth {
          padding: 2rem;
          border-radius: 12px;
          max-width: 400px;
          margin: auto;
        }

        .two-factor-auth h2 {
          margin-top: 0;
          text-align: center;
          color: white;
        }

        .auth-step {
          margin: 1.5rem 0;
        }

        .auth-step p {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          margin: 1rem 0;
        }

        .method-options {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .method-btn {
          flex: 1;
          padding: 1rem;
          border: 2px solid transparent;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .method-btn.active {
          border-color: #4a90e2;
          background: rgba(74, 144, 226, 0.2);
        }

        .otp-input-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1rem 0;
        }

        .otp-input {
          flex: 1;
          padding: 1rem;
          font-size: 2rem;
          letter-spacing: 0.5rem;
          text-align: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-family: monospace;
        }

        .otp-input:focus {
          outline: none;
          border-color: #4a90e2;
          background: rgba(0, 0, 0, 0.3);
        }

        .time-remaining {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          min-width: 40px;
          text-align: right;
        }

        .attempts-left {
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .resend-btn {
          display: block;
          margin: 1rem auto;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 0.875rem;
        }

        .resend-btn:hover {
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
        }

        .success-icon {
          font-size: 3rem;
          text-align: center;
          color: #4ade80;
          margin: 1rem 0;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 6px;
          padding: 0.75rem;
          color: #fca5a5;
          margin: 1rem 0;
          text-align: center;
          font-size: 0.875rem;
        }

        .success-message {
          background: rgba(74, 222, 128, 0.2);
          border: 1px solid rgba(74, 222, 128, 0.4);
          border-radius: 6px;
          padding: 0.75rem;
          color: #86efac;
          margin: 1rem 0;
          text-align: center;
          font-size: 0.875rem;
        }

        .auth-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: transparent;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
        }

        .cancel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default TwoFactorAuth
