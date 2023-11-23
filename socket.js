import UserService from './src/services/user.service.js';

const userService = new UserService();

export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom, idUser, user } = handshake.query;

    console.log(`User connected ${id} ==> ${nameRoom}`);
    socket.join(nameRoom);
    // Cuando se conecta un nuevo usuario haz o siguiente:
    socket.on('userConnected', (data) => {
      if (idUser) {
        userService.updateUser(idUser, { is_connected: true });
      }
      socket.broadcast.emit('userConnected', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      if (idUser) {
        userService.updateUser(idUser, { is_connected: false });
      }
      socket.broadcast.emit('userDisconected', idUser);
    });

    socket.on('createUser', (data) => {
      // console.log(data);
      socket.broadcast.emit('createUser', data);
    });
  });
};
