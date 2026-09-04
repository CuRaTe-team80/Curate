import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import "./Navbar.css";

function Navbar({ currentView, onNavigate }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("curate_theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("curate_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="navbar-logo" aria-hidden="true">
          ◆
        </span>
        <span className="navbar-name">Curate</span>
      </div>

      {/* Navigation */}
      <div className="navbar-links">
        <button
          type="button"
          className={`navbar-link${
            currentView === "board" ? " navbar-link--active" : ""
          }`}
          onClick={() => onNavigate("board")}
        >
          Board
        </button>

        <button
          type="button"
          className={`navbar-link${
            currentView === "dashboard" ? " navbar-link--active" : ""
          }`}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={`navbar-link${
            currentView === "notifications" ? " navbar-link--active" : ""
          }`}
          onClick={() => onNavigate("notifications")}
        >
          Notifications
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          className="btn btn-secondary theme-toggle"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? "☀" : "☾"}
        </button>

        <UserMenu onNavigate={onNavigate} />
      </div>
    </nav>
  );
}

export default Navbar;