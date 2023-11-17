import { Server as WebSocketServer } from 'socket.io';
import { httpServer } from './index.js';

export const io = new WebSocketServer(httpServer, {
  cors: {
    origins: ['http://localhost:4200'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
