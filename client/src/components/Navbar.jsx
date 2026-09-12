import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";
import "./Navbar.css";

const RECENT_BOARDS_KEY = "curate_recent_boards";

function Navbar(props) {
  const currentView = props.currentView;
  const onNavigate = props.onNavigate;
  const onSelectBoard = props.onSelectBoard;
  const selectedBoard = props.selectedBoard;

  const [dark, setDark] = useState(function () {
    return localStorage.getItem("curate_theme") === "dark";
  });

  const [recentBoards, setRecentBoards] = useState(function () {
    try {
      const savedBoards = localStorage.getItem(RECENT_BOARDS_KEY);
      return savedBoards ? JSON.parse(savedBoards) : [];
    } catch {
      return [];
    }
  });

  const [showRecentBoards, setShowRecentBoards] = useState(false);

  useEffect(function () {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("curate_theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(function () {
  if (!selectedBoard || !selectedBoard.id) return;

  setRecentBoards(function (previousBoards) {
    const updatedBoards = [
      selectedBoard, // store the whole board object, not just id/name
      ...previousBoards.filter(function (board) {
        return board.id !== selectedBoard.id;
      }),
    ].slice(0, 3);

    localStorage.setItem(
      RECENT_BOARDS_KEY,
      JSON.stringify(updatedBoards)
    );

    return updatedBoards;
  });
}, [selectedBoard]);

  function linkClass(name) {
    var base = "navbar-link";

    if (currentView === name) {
      base = base + " navbar-link--active";
    }

    return base;
  }

  function handleRecentBoardClick(board) {
    setShowRecentBoards(false);

    if (onSelectBoard) {
      onSelectBoard(board);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <svg className="navbar-logo-mark" viewBox="0 0 100 100" aria-hidden="true" width="26" height="26">
          <g transform="translate(50,50)">
            <rect x="-23" y="-23" width="30" height="30" rx="3" transform="rotate(45)" fill="#0a5a61" opacity="0.9"/>
            <rect x="-15" y="-15" width="26" height="26" rx="3" transform="rotate(45)" fill="#0e7c86" opacity="0.92"/>
            <rect x="-8" y="-8" width="21" height="21" rx="3" transform="rotate(45)" fill="#4fd0db"/>
          </g>
        </svg>
        <span className="navbar-name">Curate</span>
      </div>

      <div className="navbar-links">
        <button
          type="button"
          className={linkClass("boards")}
          onClick={function () {
            onNavigate("boards");
          }}
        >
          Boards
        </button>

        <button
  type="button"
  className={linkClass("board")}
  onClick={function () {
    onNavigate("board");
  }}
>
  Board{selectedBoard ? ` — ${selectedBoard.name}` : ''}
</button>

        <button
          type="button"
          className={linkClass("dashboard")}
          onClick={function () {
            onNavigate("dashboard");
          }}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={linkClass("notifications")}
          onClick={function () {
            onNavigate("notifications");
          }}
        >
          Notifications
        </button>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={function () {
              setShowRecentBoards(function (previous) {
                return !previous;
              });
            }}
            aria-expanded={showRecentBoards}
          >
            Recent Boards ▾
          </button>

          {showRecentBoards && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: "220px",
                padding: "8px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-md)",
                zIndex: 1000,
              }}
            >
              {recentBoards.length === 0 ? (
                <div
                  style={{
                    padding: "10px",
                    color: "var(--color-text-muted)",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  No recently viewed boards
                </div>
              ) : (
                recentBoards.map(function (board) {
                  return (
                    <button
                      key={board.id}
                      type="button"
                      onClick={function () {
                        handleRecentBoardClick(board);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        background: "transparent",
                        color: "var(--color-text)",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      {board.name}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-secondary theme-toggle"
          onClick={function () {
            setDark(function (d) {
              return !d;
            });
          }}
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
