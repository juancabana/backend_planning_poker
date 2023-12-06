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
    default: true,
  },
  is_connected: {
    type: Boolean,
    default: true,
  },
  selected_card: {
    type: Number,
    default: -1,
  },
});
export default model('User', UserSchema);
