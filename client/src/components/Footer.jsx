import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo" aria-hidden="true">◆</span>
          <span className="footer-name">Curate</span>
        </div>
        <p className="footer-tagline">
          Label data together, without losing the truth.
        </p>
        <div className="footer-links">
          <a href="https://github.com/CuRaTe-team80/Curate" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="footer-divider" aria-hidden="true">·</span>
          <span>Built by Team CuRaTe</span>
        </div>
        <p className="footer-copyright">© 2026 Curate. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;