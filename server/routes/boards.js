const express = require('express');
const router = express.Router();
const { getAllBoards, createBoard, deleteBoard } = require('../controllers/boardsController');

router.get('/', getAllBoards);
router.post('/', createBoard);
router.delete('/:id', deleteBoard);
module.exports = router;