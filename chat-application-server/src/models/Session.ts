/**
 * Modèle pour les sessions.
 * @module models/Session
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface représentant une session dans la base de données.
 */
interface ISession extends Document {
  userAgent: string;
  token: string;
  validity: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les sessions.
 */
const sessionSchema: Schema<ISession> = new Schema({
  userAgent: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  validity: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '48h' } // Supprime automatiquement les sessions après 48 heures
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

/**
 * Modèle mongoose pour les sessions.
 */
export const SessionModel = mongoose.model<ISession>("Sessions", sessionSchema);
