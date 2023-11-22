import expres from 'express';
import roomRouter from './room/room.router.js';
import userRouter from './user/user.router.js';

const router = expres.Router();

router.use('/room', roomRouter);
router.use('/user', userRouter);

export default router;
