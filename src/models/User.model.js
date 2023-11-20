// Crea un esquema de mongoose para la colección users:
// Path: src/models/User.model.js

import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },

  visualisation: {
    type: String,
    required: true,
    enum: ['player', 'spectator'],
  },

  is_owner: {
    type: Boolean,
    default: false,
  },
});
