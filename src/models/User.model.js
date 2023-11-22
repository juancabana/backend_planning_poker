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
  room_id: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  visualization: {
    type: String,
    required: true,
    enum: ['player', 'spectator'],
  },

  is_owner: {
    type: Boolean,
    default: false,
  },
});
export default model('User', UserSchema);
