import { eventEmitter } from './src/services/user.service.js';
import { getFromCache, setInCache } from './cache.js';
export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom, idUser, user, is_registered } = handshake.query;

    console.log(`User connected ${id} ==> ${nameRoom}`);
    socket.join(nameRoom);
    // Cuando se conecta un nuevo usuario haz o siguiente:
    // 1. Obtener los usuarios que hay en el caché
    const players = getFromCache('players');

    if (is_registered) {
      console.log('is_registered');
      if (user._id) {
        const userConnected = players.find((player) => player._id === idUser);
        const newPlayers = [...players, { is_active: true, ...userConnected }];
        setInCache('players', newPlayers);
        socket.broadcast.emit('userConnected', newPlayers);
      }
    } else {
      console.log('is not registered');
      // const players = getFromCache('players');
      // if (!players && !is_registered) {
      //   setInCache('players', [{ is_active: true, ...user }]);
      //   socket.broadcast.emit('userConnected', [{ is_active: true, ...user }]);
      //   return;
      // }
      // // const newListPlayers = [...players, { is_active: true, ...user }];
      // // setInCache('players', newListPlayers);
      // // 3. Emitir la lista de usuarios a todos los clientes
      // socket.broadcast.emit('userConnected', players);
    }

    socket.on('disconnect', (id) => {
      const players = getFromCache('players');
      if (is_registered && user._id) {
        const newPlayers = players.filter((player) => player._id !== idUser);
        setInCache('players', newPlayers);
        console.log(`User disconnected - registered`, newPlayers);
        socket.broadcast.emit('userDisconected', newPlayers);
        // const userDisconnected = players.find((user) => user._id === idUser);
        // const newPlayers = [
        //   ...players,
        //   { is_active: false, ...userDisconnected },
        // ];
        // setInCache('players', newPlayers);
        // socket.broadcast.emit('userDisconected', user);
        return;
      }
      if (!players) {
        console.log(`User disconnected - not registered - !players`, []);
        socket.broadcast.emit('userDisconected', []);
        return;
      }
      console.log(`User disconnected - not registered - players`, players);
      socket.broadcast.emit('userDisconected', players);
    });

    eventEmitter.on('userCreated', (newPlayers) => {
      socket.broadcast.emit('userCreated', newPlayers);
    });
  });
};
