import Room from '../models/Room.model.js';
import boom from '@hapi/boom';
import UserService from './user.service.js';

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
        throw boom.notFound('Room not found');
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

      return room;
    } catch (error) {
      // Manejar errores, log, o re-lanzar según sea necesario
      throw error;
    }
  };
  createRoom = async ({ tittle }) => {
    const newRroom = await Room.create({ tittle });
    //   io.emit('newRoom', room);
    return newRroom;
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
