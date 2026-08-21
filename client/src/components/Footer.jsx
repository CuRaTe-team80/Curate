import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        padding: 'var(--space-4)',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        marginTop: 'auto',
      }}
    >
      <p>&copy; 2026 Curate. All rights reserved.</p>
    </footer>
  );
}