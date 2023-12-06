import User from '../models/User.model.js';
import boom from '@hapi/boom';
import RoomModel from '../models/Room.model.js';
import { EventEmitter } from 'events';
import { getFromCache, setInCache } from './../../cache.js';

const eventEmitter = new EventEmitter();

class UserService {
  createUser = async (payload) => {
    const { username, room_id, visualization, is_owner } = payload;
    const room = await RoomModel.findById(room_id);
    if (!room) {
      throw boom.notFound('Room not found' + username);
    }

    const newUser = await User.create({
      username,
      room_id,
      visualization,
      is_owner: room.players.length === 0,
    });
    const userOptimized = {
      _id: newUser._id,
      username: newUser.username,
      room_id: newUser.room_id,
      visualization: newUser.visualization,
      is_owner: newUser.is_owner,
      is_connected: newUser.is_connected,
      selected_card: newUser.selected_card,
    };
  
    // Almacenar el usuario en los usuarios que hay en el caché
    const users = getFromCache('players');

    if (!users) {
      setInCache('players', [userOptimized]);
      return userOptimized;
    }
    const newPlayers = [...users, userOptimized];
    setInCache('players', newPlayers);
    eventEmitter.emit('userCreated', newPlayers);
    return userOptimized;
  };
  findOne = async (id) => {
    const user = User.findById(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  };

  deleteUser = async (id) => {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error(error);
      // Aquí puedes manejar el error de la manera que prefieras.
      // Por ejemplo, podrías devolver null o un mensaje de error.
      return null;
    }
  };
  updateUser = async (id, payload) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedUser) {
      throw boom.notFound('User not found');
    }
    return updatedUser;
  };
}
export { eventEmitter };

export default UserService;
