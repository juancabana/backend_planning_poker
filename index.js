import express from 'express';
import http from 'http';
import connectDB from './src/lib/db.js';
import { Server as WebSocketServer } from 'socket.io';

import {
  errorHandler,
  logErrors,
  boomErrorHandler,
} from './src/middlewares/error.handler.js';
import router from './src/routes/index.router.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
connectDB();

const httpServer = http.createServer(app);

const io = new WebSocketServer(httpServer, {
  cors: {
    origins: ['http://localhost:4200'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use('/api', router);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
