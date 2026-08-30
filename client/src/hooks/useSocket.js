import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export function useSocket(onSampleUpdated, showToast) {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('sampleUpdated', (updatedSample) => {
      console.log('Live sample update received:', updatedSample);
      if (onSampleUpdated) {
        onSampleUpdated(updatedSample);
      }
      if (showToast) {
        showToast('A sample was updated by another user.', 'success');
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [onSampleUpdated, showToast]);
}