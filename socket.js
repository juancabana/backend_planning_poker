export default (io) => {
  io.on('connection', (socket) => {
    // IMPRIMIR EN CONSOLA CUANDO UN USUARIO SE CONECTA CON SU ID
    // console.log('a user connected');
    console.log(socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
