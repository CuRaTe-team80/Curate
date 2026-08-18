import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

describe('Board Component', () => {
  it('renders board component without crashing', () => {
    render(<Board />);
    const boardElement = screen.getByRole('region') || screen.container;
    expect(boardElement).toBeDefined();
  });
});