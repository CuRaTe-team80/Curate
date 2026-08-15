// server/routes/samples.js
const express = require('express');
const router = express.Router();

// Mock in-memory data — replace with MongoDB/Mongoose in M3
let mockSamples = [
  {
    id: '1',
    content: 'sample-image-1.jpg',
    type: 'image',
    currentLabel: null,
    status: 'Unlabeled',
    labeledBy: null,
    history: [],
  },
  {
    id: '2',
    content: 'This product was surprisingly good.',
    type: 'text',
    currentLabel: 'positive',
    status: 'In Review',
    labeledBy: 'user123',
    history: [
      { action: 'labeled', label: 'positive', by: 'user123', at: '2026-08-05T10:00:00Z' },
    ],
  },
];

// GET /samples - list all samples
router.get('/', (req, res) => {
  res.status(200).json(mockSamples);
});

// GET /samples/:id - get a single sample
router.get('/:id', (req, res) => {
  const sample = mockSamples.find((s) => s.id === req.params.id);

  if (!sample) {
    return res.status(404).json({ message: 'Sample not found' });
  }

  res.status(200).json(sample);
});

// POST /samples - create a new sample
router.post('/', (req, res) => {
  // TODO: replace with real body validation once req.body is wired up
  const newSample = {
    id: String(mockSamples.length + 1),
    content: req.body?.content || 'placeholder-content',
    type: req.body?.type || 'text',
    currentLabel: null,
    status: 'Unlabeled',
    labeledBy: null,
    history: [],
  };

  mockSamples.push(newSample);
  res.status(201).json(newSample);
});

// PATCH /samples/:id - update a sample (e.g. apply/change a label)
router.patch('/:id', (req, res) => {
  const sample = mockSamples.find((s) => s.id === req.params.id);

  if (!sample) {
    return res.status(404).json({ message: 'Sample not found' });
  }

  // TODO: replace with real update logic once req.body is wired up
  const updated = {
    ...sample,
    ...req.body,
  };

  mockSamples = mockSamples.map((s) => (s.id === req.params.id ? updated : s));

  res.status(200).json(updated);
});

module.exports = router;