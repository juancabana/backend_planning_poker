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

    eventEmitter.on('userCreated', (newPlayers) => {
      socket.broadcast.emit('userCreated', newPlayers);
    });


    socket.on('cardSelected', ({ index, lastSelected, ID_user }) => {
      console.log(index, lastSelected);
      // Obtener las cartas del cache
      const cards = getFromCache('card_options');

      if (lastSelected !== null) {
        // La tarjeta que tiene en la propiedad value igual que lastSelected, va a ser igual a false
        cards.map((card) => {
          if (card.value === lastSelected) {
            card.selected = false;
          }
        });
      }
      cards[index].selected = true;
      setInCache('card_options', cards);
      socket.broadcast.emit('cardSelected', cards);
      // Establecer la propiedad selected_card del usuario en true
      const players = getFromCache('players');
      // if (!players || !thisUser) return;

      const newListPlayers = players.map((player) => {
        if (player._id == ID_user) {
          player.selected_card = cards[index].value;
        }
        return player;
      });
      setInCache('players', newListPlayers);
      socket.broadcast.emit('userCreated', newListPlayers);
      // console.log(ID_user);
    });


    
    socket.on('reveal-cards', (cardsSelected) => {
      socket.broadcast.emit('reveal-cards', cardsSelected);
    });


    socket.on('disconnect', () => {
      console.log(`User DISCONECTED ${id}`);
      // console.log(user);
      // console.log(thisUser);
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
