import { useState, useEffect } from 'react';
import Column from './Column';
import './Board.css';

const API_URL = 'http://localhost:5000/samples';

function Board() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch samples');
        return res.json();
      })
      .then((data) => {
        setSamples(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading samples...</p>;
  if (error) return <p>Error loading samples: {error}</p>;

  const unlabeled = samples.filter((s) => s.status === 'Unlabeled');
  const inReview = samples.filter((s) => s.status === 'In Review');
  const labeled = samples.filter((s) => s.status === 'Labeled');

  return (
    <div className="board">
      <Column title="Unlabeled" samples={unlabeled} />
      <Column title="In Review" samples={inReview} />
      <Column title="Labeled" samples={labeled} />
    </div>
  );
}

export default Board;