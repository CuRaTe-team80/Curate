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
    // covers malformed ObjectIds (e.g. old string ids like "1", "2")
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

const updateSample = async (req, res) => {
  try {
    const sample = await Sample.findById(req.params.id);

    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    const { currentLabel, status, labeledBy } = req.body;

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
    res.status(404).json({ message: 'Sample not found' });
  }
};

module.exports = {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
};