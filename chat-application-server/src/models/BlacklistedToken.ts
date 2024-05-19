/**
 * Modèle pour les tokens blacklistés.
 * @module models/BlacklistedToken
 * 
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface représentant un token blacklisté dans la base de données.
 * @interface IBlacklistedToken
 * @extends {Document}
 */
interface IBlacklistedToken extends Document {
  /**
   * Le token à blacklisté.
   * @type {string}
   */
  token: string;

  /**
   * La date de création du token.
   * @type {Date}
   */
  createdAt: Date;

  /**
   * La date de mise à jour du token.
   * @type {Date}
   */
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les tokens blacklistés.
 * @type {Schema<IBlacklistedToken>}
 */
const blacklistedTokenSchema: Schema<IBlacklistedToken> = new Schema({
  /**
   * Le token à blacklisté.
   * @type {string}
   * @required
   */
  token: {
    type: String,
    required: true,
  },
  /**
   * La date de création du token.
   * Expire après 7 jours.
   * @type {Date}
   * @default Date.now
   * @index { expires: '7d' }
   */
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '7d' } // Expire les tokens après 7 jours
  },
  /**
   * La date de mise à jour du token.
   * @type {Date}
   * @default Date.now
   */
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  /**
   * Options de schéma.
   * @property {boolean} timestamps - Gère automatiquement les champs createdAt et updatedAt.
   */
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

/**
 * Modèle mongoose pour les tokens blacklistés.
 * @type {mongoose.Model<IBlacklistedToken>}
 */
export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>("BlacklistedTokens", blacklistedTokenSchema);
