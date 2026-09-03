import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import "./Navbar.css";

function Navbar(props) {
  const currentView = props.currentView;
  const onNavigate = props.onNavigate;
  const [dark, setDark] = useState(function () {
    return localStorage.getItem("curate_theme") === "dark";
  });

  useEffect(function () {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("curate_theme", dark ? "dark" : "light");
  }, [dark]);

  function linkClass(name) {
    var base = "navbar-link";
    if (currentView === name) {
      base = base + " navbar-link--active";
    }
    return base;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo" aria-hidden="true">◆</span>
        <span className="navbar-name">Curate</span>
      </div>
      <div className="navbar-links">
        <button type="button" className={linkClass("boards")} onClick={function () { onNavigate("boards"); }}>
          Boards
        </button>
        <button type="button" className={linkClass("board")} onClick={function () { onNavigate("board"); }}>
          Board
        </button>
        <button type="button" className={linkClass("dashboard")} onClick={function () { onNavigate("dashboard"); }}>
          Dashboard
        </button>
        <button
          type="button"
          className="btn btn-secondary theme-toggle"
          onClick={function () { setDark(function (d) { return !d; }); }}
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
