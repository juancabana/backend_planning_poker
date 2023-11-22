import User from '../models/User.model.js';
import boom from '@hapi/boom';
import RoomModel from '../models/Room.model.js';

class UserService {
  createUser = async (payload) => {
    const { username, room_id, visualisation, is_owner } = payload;
    const room = await RoomModel.findById(room_id);
    if (!room) {
      throw boom.notFound('Room not found');
    }

    const newUser = await User.create({
      username,
      room_id,
      visualisation,
      is_owner: room.players.length === 0,
    });
    return newUser;
  };
  findOne = async (id) => {
    const user = User.findById(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  };

  deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  };
  u;
}

export default UserService;
