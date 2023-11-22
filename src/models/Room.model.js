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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

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
