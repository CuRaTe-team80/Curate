const express = require('express');
const router = express.Router();
const { getAllBoards, createBoard } = require('../controllers/boardsController');

router.get('/', getAllBoards);
router.post('/', createBoard);
module.exports = router;
