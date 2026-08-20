import './Landing.css';

function Landing({ onGetStarted }) {
  return (
    <section className="landing">
      <div className="landing-hero">
        <span className="landing-eyebrow">For teams labeling ML data</span>
        <h1>Label data together, without losing the truth.</h1>
        <p className="landing-sub">
          Curate turns your dataset into a shared Kanban board — samples flow from
          Unlabeled to In Review to Labeled, with live conflict detection when two
          people disagree.
        </p>
        <div className="landing-actions">
          <button className="btn btn-primary" onClick={onGetStarted}>Open the board</button>
          <a href="/register" className="btn btn-secondary">Create an account</a>
        </div>
      </div>
      <div className="landing-features">
        <div className="card">
          <h3>Unlabeled → Labeled</h3>
          <p>A clear three-column pipeline every sample moves through.</p>
        </div>
        <div className="card">
          <h3>Conflict detection</h3>
          <p>Disagreements get flagged instead of silently overwritten.</p>
        </div>
        <div className="card">
          <h3>Built for teams</h3>
          <p>Real-time sync so nobody re-labels what's already done.</p>
        </div>
      </div>
    </section>
  );
}

export default Landing;