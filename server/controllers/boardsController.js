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
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }
  try {
    const newBoard = await Board.create({ name, description: description || '' });
    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create board' });
  }
};

module.exports = { getAllBoards, createBoard };
