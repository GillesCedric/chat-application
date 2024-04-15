import mongoose from "mongoose";

interface IChat extends mongoose.Document {
  conversation: mongoose.Types.ObjectId[];
  message: mongoose.Types.ObjectId[];
  deleted: string
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversations',
  },
  message: {
    type: String,
    required: true,
  },
  deleted: {
    type: String,
    default: false,
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

export const ChatModel = mongoose.model<IChat>('Chats', chatSchema);
