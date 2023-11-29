import { eventEmitter } from './src/services/user.service.js';
import { getFromCache, setInCache } from './cache.js';
export default (io) => {
  io.on('connection', (socket) => {
    const { id, handshake } = socket;
    const { nameRoom, user, is_registered } = handshake.query;
    const thisUser = JSON.parse(user);
    let idUser = false;

    // const existId = () => {
    //   if (!thisUser) return false;
    //   if (thisUser._id) {
    //     idUser = thisUser._id;
    //     return idUser;
    //   }
    // };
    // existId();

    console.log(`User CONNECTED ${id} ==> ${nameRoom}`);
    // console.log(user);
    // socket.join(nameRoom);
    // // Cuando se conecta un nuevo usuario haz o siguiente:
    // // 1. Obtener los usuarios que hay en el caché
    // const players = getFromCache('players');

    // // Funcion para saber si el usuario ya existe en la lista de players
    // const existUser = (id) => {
    //   const players = getFromCache('players');
    //   // Saber si en players existe un usuario con el mismo id
    //   if (!players) return false;
    //   if (players.length === 0) return false;
    //   if (players.length > 0) {
    //     const userConnected = players.find((player) => player._id === id);
    //     if (userConnected) return true;
    //   }
    // };

    // if (thisUser._id) {
    //   console.log('is_registered');
    //   // if (user._id) {
    //   // const userConnected = players.find((player) => player._id === idUser);
    //   if (!players) return;
    //   if (players.length === 0) {
    //     socket.broadcast.emit('userConnected', getFromCache('players'));
    //     return setInCache('players', [thisUser]);
    //   }
    //   if (players.length > 0 && existUser(thisUser._id)) {
    //     const userConnected = players.find((player) => player._id === idUser);
    //     socket.broadcast.emit('userConnected', getFromCache('players'));
    //     if (userConnected) return;
    //   }
    //   // }
    // }

    eventEmitter.on('userCreated', (newPlayers) => {
      socket.broadcast.emit('userCreated', newPlayers);
    });
    socket.on('cardSelected', (value) => {
      // console.log('Se ha seleccionado una carta', value);
      socket.broadcast.emit('cardSelected', value);
    });

    socket.on('disconnect', () => {
      console.log(`User DISCONECTED ${id}`);
      console.log(user);
      console.log(thisUser);
      // const players = getFromCache('players');
      // if (!players || !thisUser) return;

      // const newListPlayers = players.filter(
      //   (player) => player._id != thisUser._id
      // );
      // setInCache('players', newListPlayers);
      // socket.broadcast.emit('userDisconected', newListPlayers);
    });
  });
};
