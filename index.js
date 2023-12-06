import express from 'express';
import { Server as WebSocketServer } from 'socket.io';
import http from 'http';
import { connectDB } from './src/lib/db.js';
import Sockets from './socket.js';

import {
  errorHandler,
  logErrors,
  boomErrorHandler,
} from './src/middlewares/error.handler.js';
import router from './src/routes/index.router.js';
import cors from 'cors';
import { setInCache, getFromCache } from './cache.js';

const app = express();
const port = 3000;

connectDB();

const server = http.createServer(app);
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Cors
app.use(cors());

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Connect Socket.io to the same HTTP server
const io = new WebSocketServer(server, {
  cors: {
    origins: ['http://localhost:4200'],
  },
});

Sockets(io);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});
// Ruta para obtener las tarjetas a elegir
app.get('/api/card_options', async (req, res, next) => {
  setInCache('card_options', [
    { value: 0, viewValue: '0', selected: false },
    { value: 1, viewValue: '1', selected: false },
    { value: 3, viewValue: '3', selected: false },
    { value: 5, viewValue: '5', selected: false },
    { value: 8, viewValue: '8', selected: false },
    { value: 13, viewValue: '13', selected: false },
    { value: 21, viewValue: '21', selected: false },
    { value: 34, viewValue: '34', selected: false },
    { value: 55, viewValue: '55', selected: false },
    { value: 89, viewValue: '89', selected: false },
    { value: -1, viewValue: '?', selected: false },
    { value: -2, viewValue: '☕', selected: false },
  ]);
  try {
    const cardOptions = getFromCache('card_options');
    if (!cardOptions) return res.json([]);
    res.json(cardOptions);
  } catch (err) {
    next(err);
  }
});
// Move the route setup after Socket.io setup
app.use('/api', router);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
