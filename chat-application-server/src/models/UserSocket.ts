import mongoose from "mongoose";

interface IUserSocket extends mongoose.Document {
  user: mongoose.Types.ObjectId
  socket: string
  createdAt: Date
  updatedAt: Date
}

const userSocketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  socket: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

export const UserSocketModel = mongoose.model<IUserSocket>("UsersSockets", userSocketSchema);
