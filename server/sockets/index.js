const { Server } = require('socket.io');

function initSockets(httpServer) {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  // boardId -> Map(socketId -> email)
  const boardPresence = new Map();

  function getBoardUsers(boardId) {
    const map = boardPresence.get(boardId);
    if (!map) return [];
    return Array.from(map.values());
  }

  function broadcastPresence(boardId) {
    io.to('board:' + boardId).emit('presenceUpdate', {
      boardId: boardId,
      users: getBoardUsers(boardId),
    });
  }

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinBoard', (data) => {
      const boardId = data.boardId;
      const email = data.email;
      socket.data.boardId = boardId;
      socket.data.email = email;
      socket.join('board:' + boardId);

      if (!boardPresence.has(boardId)) {
        boardPresence.set(boardId, new Map());
      }
      boardPresence.get(boardId).set(socket.id, email);
      broadcastPresence(boardId);
    });

    socket.on('leaveBoard', (data) => {
      const boardId = data.boardId;
      socket.leave('board:' + boardId);
      const map = boardPresence.get(boardId);
      if (map) {
        map.delete(socket.id);
        broadcastPresence(boardId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      const boardId = socket.data.boardId;
      if (boardId) {
        const map = boardPresence.get(boardId);
        if (map) {
          map.delete(socket.id);
          broadcastPresence(boardId);
        }
      }
    });
  });

  return io;
}

module.exports = initSockets;
