const Sample = require('../models/Sample'); // Ensure path matches your model

// GET /api/samples
const getAllSamples = async (req, res) => {
  try {
    const samples = await Sample.find({});
    res.status(200).json(samples);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching samples', error: err.message });
  }
};

// GET /api/samples/:id
const getSampleById = async (req, res) => {
  try {
    const sample = await Sample.findById(req.params.id);
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    res.status(200).json(sample);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid sample id.' });
    }
    res.status(500).json({ message: 'Server error fetching sample', error: err.message });
  }
};

// POST /api/samples
const createSample = async (req, res) => {
  try {
    const newSample = new Sample(req.body);
    const savedSample = await newSample.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('sampleCreated', savedSample);
    }

    res.status(201).json(savedSample);
  } catch (err) {
    res.status(400).json({ message: 'Error creating sample', error: err.message });
  }
};

// PATCH /api/samples/:id
const updateSample = async (req, res) => {
  try {
    const sample = await Sample.findById(req.params.id);
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    const { currentLabel, status, labeledBy, clientUpdatedAt } = req.body;

    if (clientUpdatedAt) {
      const currentUpdatedAt = new Date(sample.updatedAt).getTime();
      const clientKnownUpdatedAt = new Date(clientUpdatedAt).getTime();
      if (currentUpdatedAt > clientKnownUpdatedAt) {
        return res.status(409).json({
          message: 'This sample was modified by someone else since you last loaded it.',
          currentSample: sample,
        });
      }
    }

    if (currentLabel !== undefined) sample.currentLabel = currentLabel;
    if (status !== undefined) sample.status = status;
    if (labeledBy !== undefined) sample.labeledBy = labeledBy;

    if (currentLabel !== undefined) {
      sample.history.push({
        action: 'labeled',
        label: currentLabel,
        by: labeledBy || sample.labeledBy || 'unknown',
        at: new Date().toISOString(),
      });
    }

    await sample.save();

    // Notify every connected client that this sample changed
    const io = req.app.get('io');
    if (io) {
      io.emit('sampleUpdated', sample);
    }

    res.status(200).json(sample);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid sample id.' });
    }
    res.status(500).json({ message: 'Error updating sample', error: err.message });
  }
};

// GET /samples/export - download all samples as CSV
const exportSamples = async (req, res) => {
  try {
    const samples = await Sample.find({});

    const escapeCsvField = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['id', 'content', 'type', 'currentLabel', 'status', 'labeledBy', 'createdAt', 'updatedAt'];
    const rows = samples.map((s) =>
      [
        s._id.toString(),
        s.content,
        s.type,
        s.currentLabel,
        s.status,
        s.labeledBy,
        s.createdAt ? s.createdAt.toISOString() : '',
        s.updatedAt ? s.updatedAt.toISOString() : '',
      ]
        .map(escapeCsvField)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="curate-samples-export.csv"');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Error exporting samples', error: err.message });
  }
};

module.exports = {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
  exportSamples,
};