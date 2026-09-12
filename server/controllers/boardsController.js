const Board = require('../models/Board');

const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch boards' });
  }
};

const createBoard = async (req, res) => {
  const { name, description, labels } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }
  try {
    const newBoard = await Board.create({
      name,
      description: description || '',
      labels: labels && labels.length > 0 ? labels : undefined, // undefined lets schema default apply if empty
    });
    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create board' });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json({ message: 'Board deleted', id: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid board id.' });
    }
    res.status(500).json({ message: 'Failed to delete board' });
  }
};

module.exports = { getAllBoards, createBoard, deleteBoard };