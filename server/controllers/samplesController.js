// server/controllers/samplesController.js

// In-memory store — replace with MongoDB/Mongoose in Sprint 3
let samples = [
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

let nextId = 3;

// GET /samples
const getAllSamples = (req, res) => {
  res.status(200).json(samples);
};

// GET /samples/:id
const getSampleById = (req, res) => {
  const sample = samples.find((s) => s.id === req.params.id);

  if (!sample) {
    return res.status(404).json({ message: 'Sample not found' });
  }

  res.status(200).json(sample);
};

// POST /samples
const createSample = (req, res) => {
  const { content, type } = req.body;

  if (!content || !type) {
    return res.status(400).json({ message: 'content and type are required' });
  }

  const newSample = {
    id: String(nextId++),
    content,
    type,
    currentLabel: null,
    status: 'Unlabeled',
    labeledBy: null,
    history: [],
  };

  samples.push(newSample);
  res.status(201).json(newSample);
};

// PATCH /samples/:id
const updateSample = (req, res) => {
  const sample = samples.find((s) => s.id === req.params.id);

  if (!sample) {
    return res.status(404).json({ message: 'Sample not found' });
  }

  const { currentLabel, status, labeledBy } = req.body;

  if (currentLabel !== undefined) sample.currentLabel = currentLabel;
  if (status !== undefined) sample.status = status;
  if (labeledBy !== undefined) sample.labeledBy = labeledBy;

  // record the change in history if a label was actually set
  if (currentLabel !== undefined) {
    sample.history.push({
      action: 'labeled',
      label: currentLabel,
      by: labeledBy || sample.labeledBy || 'unknown',
      at: new Date().toISOString(),
    });
  }

  res.status(200).json(sample);
};

module.exports = {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
};