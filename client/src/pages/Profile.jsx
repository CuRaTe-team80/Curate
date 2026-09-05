import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Could not load profile.');
        }
        setUser(data.user);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  function validatePasswordForm() {
    const next = {};
    if (!currentPassword) next.currentPassword = 'Current password is required';
    if (!newPassword) next.newPassword = 'New password is required';
    else if (newPassword.length < 6) next.newPassword = 'Must be at least 6 characters';
    if (confirmPassword !== newPassword) next.confirmPassword = 'Passwords do not match';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    if (!validatePasswordForm()) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not update password.');
      }
      setPasswordMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <p style={{ color: 'var(--color-text-muted)' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="card auth-card" style={{ maxWidth: '480px' }}>
        <h1 className="auth-title">Account Settings</h1>

        {fetchError ? (
          <div className="auth-error-banner" role="alert">{fetchError}</div>
        ) : (
          <>
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Email</p>
              <p style={{ color: 'var(--color-text)', fontWeight: 600 }}>{user?.email}</p>
            </div>

            {user?.createdAt && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  Member since
                </p>
                <p style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </>
        )}

        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>
          Change Password
        </h2>

        {passwordMessage && (
          <div
            style={{
              background: 'var(--color-success)',
              color: 'var(--color-surface)',
              padding: 'var(--space-3)',
              borderRadius: '6px',
              marginBottom: 'var(--space-4)',
              fontSize: '0.9rem',
            }}
          >
            {passwordMessage}
          </div>
        )}
        {passwordError && (
          <div className="auth-error-banner" role="alert">{passwordError}</div>
        )}

        <form onSubmit={handlePasswordSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              id="current-password"
              className={`input ${formErrors.currentPassword ? 'input-error' : ''}`}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={saving}
            />
            {formErrors.currentPassword && (
              <span className="field-error">{formErrors.currentPassword}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              className={`input ${formErrors.newPassword ? 'input-error' : ''}`}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={saving}
            />
            {formErrors.newPassword && (
              <span className="field-error">{formErrors.newPassword}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirm-new-password">Confirm New Password</label>
            <input
              id="confirm-new-password"
              className={`input ${formErrors.confirmPassword ? 'input-error' : ''}`}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={saving}
            />
            {formErrors.confirmPassword && (
              <span className="field-error">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={saving}>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}