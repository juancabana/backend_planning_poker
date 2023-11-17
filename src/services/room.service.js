import Room from '../models/Room.model.js';
import boom from '@hapi/boom';

class RoomService {
  findAll = async () => {
    const rooms = await Room.find();
    //   io.emit('newRoom', room);
    return rooms;
  };

  findOne = async (id) => {
    const room = await Room.findById(id);
    // Retorna un throw error si no encuentra la room
    if (!room) {
      throw boom.notFound('Room not found');
    } // io.emit('newRoom', room);
    return room;
  };

  createRoom = async (room) => {
    const newRroom = await Room.create(room);
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
}

export default RoomService;
