import mongoose from "mongoose";

interface IChat extends mongoose.Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversations',
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  message: {
    type: String,
    required: true,
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
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
