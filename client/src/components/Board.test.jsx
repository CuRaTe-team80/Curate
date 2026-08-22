import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

const mockSamples = [
  { id: '1', content: 'Sample text 1', type: 'text', status: 'Unlabeled', currentLabel: null },
  { id: '2', content: 'Sample text 2', type: 'text', status: 'In Review', currentLabel: 'positive' },
];

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

describe('Board Component', () => {
  it('shows a loading state before data arrives', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<Board />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders real sample data once the fetch resolves', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockSamples,
    });

    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText('Sample text 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Sample text 2')).toBeInTheDocument();
  });

  it('shows an error state when the fetch fails', async () => {
    global.fetch.mockResolvedValue({ ok: false });

    render(<Board />);

    await waitFor(() => {
      expect(screen.getByText(/unable to load samples/i)).toBeInTheDocument();
    });
  });
});