// server/routes/samples.js
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