import { useState, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import './Notifications.css';

function formatActivityTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActivityIcon(type) {
  if (type === 'error') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  if (type === 'warning') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Notifications() {
  const { activities, clearActivities } = useToast();
  const [filter, setFilter] = useState('all');

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    return activities.filter((act) => act.type === filter);
  }, [activities, filter]);

  return (
    <div className="notifications-wrapper">
      <main className="notifications-page">
        <section className="notifications-header">
          <div>
            <p className="notifications-eyebrow">ACTIVITY CENTER</p>
            <h1>Notifications</h1>
            <p className="notifications-subtitle">
              Keep track of recent activity across your Curate workspace.
            </p>
          </div>

          {activities.length > 0 && (
            <button
              type="button"
              className="btn-clear"
              onClick={clearActivities}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Clear history</span>
            </button>
          )}
        </section>

        {activities.length > 0 && (
          <div className="notifications-filters" role="tablist" aria-label="Filter notifications">
            <button
              type="button"
              className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All <span className="chip-count">{activities.length}</span>
            </button>
            <button
              type="button"
              className={`filter-chip ${filter === 'info' || filter === 'success' ? 'active' : ''}`}
              onClick={() => setFilter('info')}
            >
              Updates
            </button>
            <button
              type="button"
              className={`filter-chip ${filter === 'warning' ? 'active' : ''}`}
              onClick={() => setFilter('warning')}
            >
              Warnings
            </button>
            <button
              type="button"
              className={`filter-chip ${filter === 'error' ? 'active' : ''}`}
              onClick={() => setFilter('error')}
            >
              Errors
            </button>
          </div>
        )}

        <section
          className="notifications-feed"
          aria-label="Recent activity feed"
        >
          {filteredActivities.length === 0 ? (
            <div className="notifications-empty">
              <div className="notifications-empty-badge">
                <div className="notifications-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
              </div>
              <h2>No recent activity</h2>
              <p>Your recent workspace logs and notifications will appear here.</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <article
                className={`activity-item activity-item--${activity.type}`}
                key={activity.id}
              >
                <div className="activity-icon" aria-hidden="true">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <time
                    className="activity-time"
                    dateTime={activity.timestamp}
                  >
                    {formatActivityTime(activity.timestamp)}
                  </time>
                </div>

                <div className="activity-status-dot" title="Recent activity" />
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;