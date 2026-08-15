import Column from './Column';

const mockSamples = [
  { id: 1, name: 'Sample A', status: 'Unlabeled' },
  { id: 2, name: 'Sample B', status: 'Unlabeled' },
  { id: 3, name: 'Sample C', status: 'In Review' },
  { id: 4, name: 'Sample D', status: 'Labeled' },
  { id: 5, name: 'Sample E', status: 'Labeled' },
];

function Board() {
  const unlabeled = mockSamples.filter((s) => s.status === 'Unlabeled');
  const inReview = mockSamples.filter((s) => s.status === 'In Review');
  const labeled = mockSamples.filter((s) => s.status === 'Labeled');

  return (
    <div className="board">
      <Column title="Unlabeled" samples={unlabeled} />
      <Column title="In Review" samples={inReview} />
      <Column title="Labeled" samples={labeled} />
    </div>
  );
}

export default Board;