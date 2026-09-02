import { useState, useEffect } from 'react';
import './BoardsList.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/boards';

function BoardsList({ onSelectBoard }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  function fetchBoards() {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch boards');
        return res.json();
      })
      .then((data) => {
        setBoards(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), description: newDescription.trim() }),
      });
      if (!res.ok) throw new Error('Failed to create board');
      const board = await res.json();
      setBoards((prev) => [board, ...prev]);
      setNewName('');
      setNewDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="boards-list">
      <div className="boards-list-header">
        <h1>Your Boards</h1>
        <p>Pick a board to open, or create a new one for a fresh dataset.</p>
      </div>

      <form className="boards-create card" onSubmit={handleCreate}>
        <input
          className="input"
          type="text"
          placeholder="Board name (e.g. Product Reviews)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={creating}
        />
        <input
          className="input"
          type="text"
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={creating}
        />
        <button className="btn btn-primary" type="submit" disabled={creating || !newName.trim()}>
          {creating ? 'Creating...' : 'Create board'}
        </button>
      </form>

      {loading && <p>Loading boards...</p>}
      {error && <p className="boards-error">{error}</p>}

      {!loading && !error && boards.length === 0 && (
        <div className="boards-empty card">
          <p>No boards yet. Create your first one above.</p>
        </div>
      )}

      <div className="boards-grid">
        {boards.map((board) => (
          <button
            key={board.id}
            className="board-card card"
            onClick={() => onSelectBoard(board)}
          >
            <h3>{board.name}</h3>
            {board.description && <p>{board.description}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardsList;
