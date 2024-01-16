import { eventEmitter } from './src/services/user.service.js';
import { getFromCache, setInCache, restartCache } from './cache.js';

export default (io) => {
  io.on('connection', (socket) => {
    // const { id, handshake } = socket;
    // const { nameRoom, user } = handshake.query;

    eventEmitter.on('userCreated', (newPlayers) => {
      socket.broadcast.emit('userCreated', newPlayers);
    });

    socket.on('cardSelected', ({ index, lastSelected, idUser }) => {
      const cards = getFromCache('card_options');
      const players = getFromCache('players');
      const newListPlayers = players.map((player) => {
        if (player._id == idUser) {
          player.selected_card = cards[index];
        }
        return player;
      });
      setInCache('players', newListPlayers);
      socket.broadcast.emit('cardSelected', newListPlayers);
    });
    
    socket.on('reveal-cards', (cardsSelected) => {
      socket.broadcast.emit('reveal-cards', cardsSelected);
    });

    socket.on('restart', (idUser) => {
      const players = getFromCache('players');
      const newPlayers = players.map((player) => {
        delete player.selected_card
        player._id == idUser ? (player.is_owner = true) : (player.is_owner = false);
        return player; 
      });
      setInCache('players', newPlayers);
      socket.broadcast.emit('restart', newPlayers);
    })

    socket.on('disconnect', () => {
      if (io.engine.clientsCount == 0) {
        restartCache()
      }
    })
  });
};
