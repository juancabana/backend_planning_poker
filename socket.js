import { eventEmitter } from './src/services/user.service.js';

export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom, idUser, user } = handshake.query;

    console.log(`User connected ${id} ==> ${nameRoom}`);
    socket.join(nameRoom);
    // Cuando se conecta un nuevo usuario haz o siguiente:
    // socket.on('userConnected', (data) => {
    socket.broadcast.emit('userConnected', user);
    // });

    socket.on('disconnect', (id) => {
      socket.broadcast.emit('userDisconected', user);
    });

    eventEmitter.on('createUser', (newUser) => {
      socket.emit('userCreated', newUser);
    });
  });
};
