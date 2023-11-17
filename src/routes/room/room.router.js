import express from 'express';
import RoomService from '../../services/room.service.js';

const router = express.Router();
const service = new RoomService();

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const room = await service.findOne(id);
    res.json(room);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const rooms = await service.findAll();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

// ruta post para crear una room
router.post('/', async (req, res, next) => {
  const payload = req.body;
  try {
    // const room = await service.createRoom(payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await service.deleteRoom(id);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
