// Crea un esquema para la colección rooms:
// Path: src/models/room.model.js

import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
  tittle: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  // Players es un array de objetos que por defecto es un array vacio

  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  averageScore: {
    type: Number,
    default: 0,
  },
});

export default model('Room', RoomSchema);
