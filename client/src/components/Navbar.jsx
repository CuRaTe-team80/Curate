import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">◆</span>
        <span className="navbar-name">Curate</span>
      </div>
      <div className="navbar-links">
        <a href="/" className="navbar-link">Board</a>
        <a href="/login" className="navbar-link">Login</a>
        <a href="/register" className="btn btn-primary navbar-cta">Get started</a>
      </div>
    </nav>
  );
}

export default Navbar;