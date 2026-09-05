const express = require('express');
const router = express.Router();
const {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
} = require('../controllers/samplesController');

router.get('/', getAllSamples);
router.get('/:id', getSampleById);
router.post('/', createSample);
router.patch('/:id', updateSample);

module.exports = router;
// Add a comment to a sample
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    const user = req.body.user || 'Isuli'; // Fallback user if not provided

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const sample = await Sample.findById(req.params.id);
    if (!sample) {
      return res.status(404).json({ error: 'Sample not found' });
    }

    const newComment = {
      text: text.trim(),
      user: user,
      createdAt: new Date()
    };

    sample.comments.push(newComment);
    await sample.save();

    res.status(201).json(sample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});