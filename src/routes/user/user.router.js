import express from 'express';
import UserService from '../../services/user.service.js';
import RoomService from '../../services/room.service.js';

const router = express.Router();
const serviceUser = new UserService();
const roomService = new RoomService();

// Create user route
router.post('/', async (req, res, next) => {
  const payload = req.body;
  try {
    const user = await serviceUser.createUser(payload);
    await roomService.addUserToRoom(user.room_id, user);
    console.log(payload);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
