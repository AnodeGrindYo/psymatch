import io from 'socket.io-client';

const initializeSocket = (socketUrl) => {
  const socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Connected to Socket.io server');
  });

  socket.on('connect_error', (error) => {
    console.log('Socket.io connection error:', error);
  });

  return socket;
};

export default initializeSocket;
