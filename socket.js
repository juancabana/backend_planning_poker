export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom, idUser, user } = handshake.query;

    console.log(`User connected ${id} ==> ${nameRoom}`);
    socket.join(nameRoom);
    // Cuando se conecta un nuevo usuario haz o siguiente:
    socket.on('userConnected', (data) => {
      socket.broadcast.emit('userConnected', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.broadcast.emit('userDisconected', idUser);
    });

    socket.on('createUser', (data) => {
      // console.log(data);
      socket.broadcast.emit('createUser', data);
    });
  });
};
