import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './authpages.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Login({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!email.includes('@')) next.email = 'Please enter a valid email address';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
      if (!data.token) {
        throw new Error('Login succeeded, but no token was returned.');
      }

      login(data.token);
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(err.message || 'Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to continue labeling.</p>

        {serverError && (
          <div className="auth-error-banner" role="alert">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className={`input ${errors.password ? 'input-error' : ''}`}
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}