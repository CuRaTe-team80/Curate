import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        padding: 'var(--space-8)',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2 style={{ color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
        404 - Page Not Found
      </h2>
      <p
        style={{
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-4)',
        }}
      >
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}
