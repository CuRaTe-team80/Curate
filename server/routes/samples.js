const express = require('express');
const router = express.Router();
const {
  getAllSamples,
  getSampleById,
  createSample,
  updateSample,
  exportSamples,
} = require('../controllers/samplesController');

router.get('/export', exportSamples); // must come before /:id
router.get('/', getAllSamples);
router.get('/:id', getSampleById);
router.post('/', createSample);
router.patch('/:id', updateSample);

module.exports = router;