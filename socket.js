export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom } = handshake.query;

    console.log(`User connected ${id} ==> ${nameRoom}`);
    socket.join(nameRoom);
    // Cuando se conecta un nuevo usuario haz o siguiente:

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('createUser', (data) => {
      // console.log(data);
      socket.broadcast.emit('createUser', data);
    });
  });
};
