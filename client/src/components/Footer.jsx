import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <svg className="footer-logo-mark" viewBox="0 0 100 100" aria-hidden="true" width="20" height="20">
            <g transform="translate(50,50)">
              <rect x="-23" y="-23" width="30" height="30" rx="3" transform="rotate(45)" fill="#0a5a61" opacity="0.9"/>
              <rect x="-15" y="-15" width="26" height="26" rx="3" transform="rotate(45)" fill="#0e7c86" opacity="0.92"/>
              <rect x="-8" y="-8" width="21" height="21" rx="3" transform="rotate(45)" fill="#4fd0db"/>
            </g>
          </svg>
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
