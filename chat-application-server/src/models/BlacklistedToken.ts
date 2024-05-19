/**
 * Modèle pour les tokens blacklistés.
 * @module models/BlacklistedToken
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface représentant un token blacklisté dans la base de données.
 */
interface IBlacklistedToken extends Document {
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les tokens blacklistés.
 */
const blacklistedTokenSchema: Schema<IBlacklistedToken> = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '7d' } // Expire les tokens après 7 jours
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

/**
 * Modèle mongoose pour les tokens blacklistés.
 */
export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>("BlacklistedTokens", blacklistedTokenSchema);
