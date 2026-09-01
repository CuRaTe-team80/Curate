import React, { useState } from 'react'
import './Landing.css'

function Landing({ onGetStarted, onNavigate }) {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 'import',
      badge: 'Step 1',
      title: 'Import & Auto-Queue',
      description: 'Upload raw datasets via CSV, JSON, or API. Unlabeled samples populate the queue automatically.',
      previewTag: 'Unlabeled (120 samples)',
      previewColor: 'var(--color-unlabeled)'
    },
    {
      id: 'review',
      badge: 'Step 2',
      title: 'Collaborative Review & Conflict Check',
      description: 'Team members annotate simultaneously. If two annotators submit conflicting labels, Curate flags it instantly.',
      previewTag: 'In Review (⚠️ Conflict Detected)',
      previewColor: 'var(--color-in-review)'
    },
    {
      id: 'export',
      badge: 'Step 3',
      title: 'Export Verified Truth',
      description: 'Consolidated, verified ground truth labels are ready for model training with zero silent overwrites.',
      previewTag: 'Labeled (Ready for Export)',
      previewColor: 'var(--color-labeled)'
    }
  ]

  return (
    <section className="landing">
      {/* Existing Hero Section */}
      <div className="landing-hero">
        <div className="landing-hero-text">
          <span className="landing-eyebrow">For teams labeling ML data</span>
          <h1 className="landing-title">
            Label data together,<br />without losing the truth.
          </h1>
          <p className="landing-sub">
            Curate turns your dataset into a shared Kanban board - samples flow from
            Unlabeled to In Review to Labeled, with live conflict detection when two
            people disagree.
          </p>
          <div className="landing-actions">
            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
              Open the board
              <span className="btn-arrow">-&gt;</span>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onNavigate && onNavigate('register')}>
              Create an account
            </button>
          </div>
          <div className="landing-stats">
            <div className="stat">
              <span className="stat-number">3</span>
              <span className="stat-label">stage pipeline</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">Live</span>
              <span className="stat-label">conflict detection</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">Real-time</span>
              <span className="stat-label">team sync</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="mockup-glow" />
          <div className="mockup-board">
            <div className="mockup-titlebar">
              <span className="mockup-dot dot-red" />
              <span className="mockup-dot dot-yellow" />
              <span className="mockup-dot dot-green" />
            </div>
            <div className="mockup-columns">
              <div className="mockup-col">
                <div className="mockup-col-header">
                  <span className="mockup-col-dot dot-gray" />
                  Unlabeled
                </div>
                <div className="mockup-card mockup-card-1" />
                <div className="mockup-card mockup-card-2" />
              </div>
              <div className="mockup-col">
                <div className="mockup-col-header">
                  <span className="mockup-col-dot dot-amber" />
                  In review
                </div>
                <div className="mockup-card mockup-card-3 mockup-card-flag" />
              </div>
              <div className="mockup-col">
                <div className="mockup-col-header">
                  <span className="mockup-col-dot dot-green" />
                  Labeled
                </div>
                <div className="mockup-card mockup-card-4" />
                <div className="mockup-card mockup-card-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="landing-features">
        <div className="card feature-card">
          <div className="feature-icon icon-teal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <h3>Unlabeled -&gt; Labeled</h3>
          <p>A clear three-column pipeline every sample moves through.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon icon-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3>Conflict detection</h3>
          <p>Disagreements get flagged instead of silently overwritten.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon icon-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" />
            </svg>
          </div>
          <h3>Built for teams</h3>
          <p>Real-time sync so nobody re-labels what's already done.</p>
        </div>
      </div>

      {/* NEW SECTION: How It Works Interactive Preview */}
      <div className="how-it-works">
        <div className="section-header">
          <span className="landing-eyebrow">Workflow</span>
          <h2>How Curate Streamlines Annotation</h2>
        </div>

        <div className="how-it-works-grid">
          <div className="steps-list">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`step-item ${activeStep === idx ? 'step-item--active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <span className="step-badge">{step.badge}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>

          <div className="step-preview-card card">
            <div className="preview-status-indicator" style={{ borderColor: steps[activeStep].previewColor }}>
              <span className="preview-status-dot" style={{ background: steps[activeStep].previewColor }} />
              <span>{steps[activeStep].previewTag}</span>
            </div>
            <div className="preview-content-placeholder">
              <div className="preview-line long" />
              <div className="preview-line medium" />
              <div className="preview-line short" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Landing