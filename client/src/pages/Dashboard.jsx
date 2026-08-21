import { useState, useEffect } from 'react';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/samples';

function Dashboard() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch samples');
        return res.json();
      })
      .then((data) => {
        setSamples(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard: {error}</p>;

  const total = samples.length;
  const unlabeled = samples.filter((s) => s.status === 'Unlabeled').length;
  const inReview = samples.filter((s) => s.status === 'In Review').length;
  const labeled = samples.filter((s) => s.status === 'Labeled').length;

  const pct = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>A quick snapshot of how the labeling effort is going.</p>
      </div>

      <div className="dashboard-summary card">
        <div className="dashboard-total">
          <span className="dashboard-total__number">{total}</span>
          <span className="dashboard-total__label">Total samples</span>
        </div>

        <p className="dashboard-summary__text">
          {labeled} of {total} samples are fully labeled ({pct(labeled)}%).
          {inReview > 0 && ` ${inReview} still ${inReview === 1 ? 'needs' : 'need'} review.`}
          {unlabeled > 0 && ` ${unlabeled} ${unlabeled === 1 ? 'is' : 'are'} untouched.`}
        </p>
      </div>

      <div className="dashboard-progress card">
        <h3>Progress by status</h3>

        <div className="dashboard-bar">
          <div
            className="dashboard-bar__segment dashboard-bar__segment--unlabeled"
            style={{ width: `${pct(unlabeled)}%` }}
          />
          <div
            className="dashboard-bar__segment dashboard-bar__segment--in-review"
            style={{ width: `${pct(inReview)}%` }}
          />
          <div
            className="dashboard-bar__segment dashboard-bar__segment--labeled"
            style={{ width: `${pct(labeled)}%` }}
          />
        </div>

        <div className="dashboard-legend">
          <div className="dashboard-legend__item">
            <span className="dot dot--unlabeled" />
            Unlabeled <strong>{unlabeled}</strong>
          </div>
          <div className="dashboard-legend__item">
            <span className="dot dot--in-review" />
            In Review <strong>{inReview}</strong>
          </div>
          <div className="dashboard-legend__item">
            <span className="dot dot--labeled" />
            Labeled <strong>{labeled}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;