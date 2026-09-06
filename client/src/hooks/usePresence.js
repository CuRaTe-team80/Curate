import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function usePresence(boardId, email) {
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!boardId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinBoard', { boardId: boardId, email: email || 'Anonymous' });
    });

    socket.on('presenceUpdate', (data) => {
      if (data.boardId === boardId) {
        setUsers(data.users);
      }
    });

    return () => {
      socket.emit('leaveBoard', { boardId: boardId });
      socket.disconnect();
    };
  }, [boardId, email]);

  return users;
}
