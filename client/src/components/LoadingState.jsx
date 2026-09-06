import React from 'react';

export default function LoadingState() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div className="skeleton-box" style={{ width: '220px', height: '36px' }}></div>
        <div className="skeleton-box" style={{ width: '120px', height: '36px' }}></div>
      </div>

      {/* Grid of Skeleton Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div className="skeleton-box" style={{ width: '40%', height: '16px' }}></div>
            <div className="skeleton-box" style={{ width: '85%', height: '24px' }}></div>
            <div className="skeleton-box" style={{ width: '100%', height: '60px', marginTop: '4px' }}></div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <div className="skeleton-box" style={{ width: '60px', height: '24px', borderRadius: '16px' }}></div>
              <div className="skeleton-box" style={{ width: '60px', height: '24px', borderRadius: '16px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
