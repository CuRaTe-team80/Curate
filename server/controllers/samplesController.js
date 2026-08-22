const Sample = require('../models/Sample');

const getAllSamples = async (req, res) => {
  try {
    const samples = await Sample.find();
    res.status(200).json(samples);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch samples' });
  }
};

const getSampleById = async (req, res) => {
  try {
    const sample = await Sample.findById(req.params.id);
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    res.status(200).json(sample);
  } catch (err) {
    res.status(404).json({ message: 'Sample not found' });
  }
};

const createSample = async (req, res) => {
  const { content, type } = req.body;
  if (!content || !type) {
    return res.status(400).json({ message: 'content and type are required' });
  }
  try {
    const newSample = await Sample.create({
      content,
      type,
      currentLabel: null,
      status: 'Unlabeled',
      labeledBy: null,
      history: [],
    });
    res.status(201).json(newSample);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create sample' });
  }
};

// PATCH /samples/:id
// Expects clientUpdatedAt — the updatedAt timestamp the client had when it
// last fetched this sample. If the sample changed in the database since
// then, someone else edited it first, so we reject with 409 instead of
// silently overwriting their change.
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
    res.status(200).json(sample);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid sample id.' });
    }
    res.status(404).json({ message: 'Sample not found' });
  }
};

module.exports = { getAllSamples, getSampleById, createSample, updateSample };