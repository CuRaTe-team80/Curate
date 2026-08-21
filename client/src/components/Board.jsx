import { useState, useEffect } from 'react';
import Column from './Column';
import SampleDetail from './SampleDetail';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import './Board.css';

const API_URL = 'http://localhost:5000/samples';

function Board() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);

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

  // Called after a successful PATCH so the whole app reflects the new label
  function handleSampleUpdate(updatedSample) {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );

    // keep the open modal in sync if it's the sample that changed
    setSelectedSample((prev) =>
      prev && prev.id === updatedSample.id ? updatedSample : prev
    );
  }

  if (loading) return <LoadingState />;

  if (error) return <ErrorState message={error} />;

  if (samples.length === 0) return <EmptyState />;

  const unlabeled = samples.filter((s) => s.status === 'Unlabeled');
  const inReview = samples.filter((s) => s.status === 'In Review');
  const labeled = samples.filter((s) => s.status === 'Labeled');

  return (
    <div className="board">
      <Column title="Unlabeled" samples={unlabeled} onSelectSample={setSelectedSample} onSampleUpdate={handleSampleUpdate} />
      <Column title="In Review" samples={inReview} onSelectSample={setSelectedSample} onSampleUpdate={handleSampleUpdate} />
      <Column title="Labeled" samples={labeled} onSelectSample={setSelectedSample} onSampleUpdate={handleSampleUpdate} />

      <SampleDetail sample={selectedSample} onClose={() => setSelectedSample(null)} />
    </div>
  );
}

export default Board;