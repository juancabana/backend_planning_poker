import express from 'express';
import { Server as WebSocketServer } from 'socket.io';
import http from 'http';
import { connectDB } from './src/lib/db.js';
import Sockets from './socket.js';

import { errorHandler, logErrors, boomErrorHandler} from './src/middlewares/error.handler.js';
import router from './src/routes/index.router.js';
import cors from 'cors';
import { setInCache, getFromCache } from './cache.js';

const app = express();
const port = 3000;

connectDB();

const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cors
app.use(cors({
  origin: ['https://d1wnuc3oc7ve09.cloudfront.net', 'http://localhost:4200'],
  optionsSuccessStatus: 200 
}));

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

const io = new WebSocketServer(server, {
  cors: {
    origins: ['http://localhost:4200'],
  },
});

Sockets(io);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/api/card_options', async (req, res, next) => {
  setInCache('card_options', [
    { id: 0 , value: 0, viewValue: '0' },
    { id: 1 , value: 1, viewValue: '1'},
    { id: 2 , value: 3, viewValue: '3' },
    { id: 3 , value: 5, viewValue: '5'},
    { id: 4 , value: 8, viewValue: '8'},
    { id: 5 , value: 13, viewValue: '13'},
    { id: 6 , value: 21, viewValue: '21'},
    { id: 7 , value: 34, viewValue: '34'},
    { id: 8 , value: 55, viewValue: '55'},
    { id: 9 , value: 89, viewValue: '89'},
    { id: 10 , value: -1, viewValue: '?'},
    { id: 11 , value: -2, viewValue: '☕'},
  ]);
  try {
    const cardOptions = getFromCache('card_options');
    if (!cardOptions) return res.json([]);
    res.json(cardOptions);
  } catch (err) {
    next(err);
  }
});

app.use('/api', router);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
