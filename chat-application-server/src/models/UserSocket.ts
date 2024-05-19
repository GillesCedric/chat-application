/**
 * Modèle pour les utilisateurs socket.
 * @module models/UserSocket
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface représentant un utilisateur socket dans la base de données.
 */
interface IUserSocket extends Document {
  user: mongoose.Types.ObjectId;
  socket: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les utilisateurs socket.
 */
const userSocketSchema: Schema<IUserSocket> = new Schema({
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
    default: Date.now,
    index: { expires: '7d' } // Supprime automatiquement les enregistrements après 7 jours
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

/**
 * Modèle mongoose pour les utilisateurs socket.
 */
export const UserSocketModel = mongoose.model<IUserSocket>("UsersSockets", userSocketSchema);
