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
  if (type === 'error') return '!';
  if (type === 'warning') return '!';
  return '✓';
}

function Notifications() {
  const { activities, clearActivities } = useToast();

  return (
    <main className="notifications-page">
      <section className="notifications-header">
        <div>
          <p className="notifications-eyebrow">ACTIVITY CENTER</p>
          <h1>Notifications</h1>
          <p>
            Keep track of recent activity across your Curate workspace.
          </p>
        </div>

        {activities.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearActivities}
          >
            Clear history
          </button>
        )}
      </section>

      <section
        className="notifications-feed"
        aria-label="Recent activity"
      >
        {activities.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">✓</div>
            <h2>No recent activity</h2>
            <p>
              Your recent Curate activity will appear here.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <article
              className={`activity-item activity-item--${activity.type}`}
              key={activity.id}
            >
              <div className="activity-icon" aria-hidden="true">
                {getActivityIcon(activity.type)}
              </div>

              <div className="activity-content">
                <p className="activity-message">
                  {activity.message}
                </p>

                <time
                  className="activity-time"
                  dateTime={activity.timestamp}
                >
                  {formatActivityTime(activity.timestamp)}
                </time>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default Notifications;