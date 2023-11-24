import { eventEmitter } from './src/services/user.service.js';
import { getFromCache, setInCache } from './cache.js';
import { disconnect } from 'mongoose';
export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom, user, is_registered } = handshake.query;
    const thisUser = JSON.parse(user);
    let idUser = false;

    const existId = () => {
      if (!thisUser) return false;
      if (thisUser._id) {
        idUser = thisUser._id;
        return idUser;
      }
    };
    existId();

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

    eventEmitter.on('userCreated', (newPlayers) => {
      socket.broadcast.emit('userCreated', newPlayers);
    });

    socket.on('disconnect', () => {
      // console.log(JSON.parse(handshake.query.user));
      console.log(thisUser);
      // Eliminar usuario desconectado de la lista de usuarios
      const players = getFromCache('players');
      if (!players) return;

      const newListPlayers = players.filter(
        (player) => player._id != thisUser._id
      );
      setInCache('players', newListPlayers);
      socket.broadcast.emit('userDisconected', newListPlayers);
    });
  });
};
