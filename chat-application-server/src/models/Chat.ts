/**
 * Modèle pour les chats.
 * @module models/Chat
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface représentant un chat dans la base de données.
 */
interface IChat extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les chats.
 */
const chatSchema: Schema<IChat> = new Schema({
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

/**
 * Modèle mongoose pour les chats.
 */
export const ChatModel = mongoose.model<IChat>('Chats', chatSchema);
