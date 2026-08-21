import './Navbar.css';

function Navbar({ currentView, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">◆</span>
        <span className="navbar-name">Curate</span>
      </div>
      <div className="navbar-links">
        <button
          type="button"
          className={`navbar-link${currentView === 'board' ? ' navbar-link--active' : ''}`}
          onClick={() => onNavigate('board')}
        >
          Board
        </button>
        <button
          type="button"
          className={`navbar-link${currentView === 'dashboard' ? ' navbar-link--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <a href="/login" className="navbar-link">Login</a>
        <a href="/register" className="btn btn-primary navbar-cta">Get started</a>
      </div>
    </nav>
  );
}

export default Navbar;