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
// import { setInCache } from './cache.js';

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

// Move the route setup after Socket.io setup
app.use('/api', router);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
