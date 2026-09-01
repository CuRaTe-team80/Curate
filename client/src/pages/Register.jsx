import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './authpages.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Register({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email address';
    
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match';
    
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('The server returned an invalid response.');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Unable to create your account. Please try again.');
      }

      if (data.token) {
        login(data.token);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setServerError(err.message || 'Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-badge">⚡ LabelPro</div>
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Join the team and start labeling samples.</p>
        </div>

        {serverError && (
          <div className="auth-error-banner" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Email Field */}
          <div className="input-group">
            <input
              id="reg-email"
              name="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              type="email"
              placeholder=" "
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
            />
            <label htmlFor="reg-email" className="floating-label">Email address</label>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <div className="input-wrapper">
              <input
                id="reg-password"
                name="password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                autoComplete="new-password"
                disabled={loading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
              />
              <label htmlFor="reg-password" className="floating-label">Password</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}

            {/* Password Strength Meter */}
            {password && (
              <div className="strength-meter">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`strength-bar ${step <= strengthScore ? `active score-${strengthScore}` : ''}`}
                    />
                  ))}
                </div>
                <span className="strength-text">{strengthLabels[strengthScore - 1] || 'Weak'}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="input-group">
            <input
              id="confirm-password"
              name="confirmPassword"
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              autoComplete="new-password"
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
            />
            <label htmlFor="confirm-password" className="floating-label">Confirm password</label>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Get Started'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}