import Room from '../models/Room.model.js';
import boom from '@hapi/boom';
import UserService from './user.service.js';
import { getFromCache, setInCache } from './../../cache.js';

const userService = new UserService();

class RoomService {
  findAll = async () => {
    const rooms = await Room.find();
    //   io.emit('newRoom', room);
    return rooms;
  };
  findOne = async (id) => {
    try {
      const room = await Room.findById(id);
      if (!room) {
        return null;
        // throw boom.notFound('Room not found');
      }

      // Consultar los objetos completos de los jugadores
      const players = await Promise.all(
        room.players.map(async (playerId) => {
          const player = await userService.findOne(playerId);
          return player;
        })
      );

      // Actualizar la propiedad "players" con los objetos completos
      room.players = players;

      return room._doc;
    } catch (error) {
      // Manejar errores, log, o re-lanzar según sea necesario
      throw error;
    }
  };
  createRoom = async ({ tittle }) => {
    const newRoom = await Room.create({ tittle });
    let players = getFromCache('players'); // Asegúrate de que 'myCache' esté definido y sea accesible
    if (!players) {
      players = [];
    }
    return { ...newRoom._doc, players };
  };
  deleteRoom = async (id) => {
    const room = await Room.findByIdAndDelete(id);
    //   io.emit('newRoom', room);
    if (!room) {
      throw boom.notFound('Room not found');
    } // io.emit('newRoom', room);
    return room;
  };
  addUserToRoom = async (id, user) => {
    const room = await Room.findByIdAndUpdate(
      id,
      { $push: { players: user } }, // Utiliza $push para agregar el ID del usuario al array
      { new: true }
    ); // Esto devolverá la habitación actualizada);
    if (!room) {
      throw boom.notFound('Room not found');
    } // io.emit('newRoom', room);
    return room;
  };
}

export default RoomService;
