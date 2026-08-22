import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './UserMenu.css';

// Decodes the payload of a JWT without verifying it — safe here because
// we're only reading a value the server already gave us, not trusting
// this decode for auth decisions (the server still verifies on every request).
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(
          (c) =>
            '%' +
            c.charCodeAt(0).toString(16).padStart(2, '0')
        )
        .join('')
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function UserMenu() {
  const { token, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const user = useMemo(() => {
    if (!token) return null;

    return decodeJwtPayload(token);
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <a
        href="/login"
        className="user-menu-login-link"
      >
        Log in
      </a>
    );
  }

  function handleLogout() {
    setOpen(false);
    logout();
    showToast('Logged out', 'success');
  }

  return (
    <div
      className="user-menu"
      ref={menuRef}
    >
      <button
        className="user-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.email}

        <span className="user-menu-caret">
          ▾
        </span>
      </button>

      {open && (
        <div
          className="user-menu-dropdown"
          role="menu"
        >
          <button
            className="user-menu-item"
            role="menuitem"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}