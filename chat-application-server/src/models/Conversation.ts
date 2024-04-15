import mongoose from "mongoose";

interface IConversation extends mongoose.Document {
  members: mongoose.Types.ObjectId[];
  chats: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ], // An array of members, where each member is represented as an object
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chats',
    },

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

export const ConversationModel = mongoose.model<IConversation>('Conversations', conversationSchema);
