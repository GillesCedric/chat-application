/**
 * Modèle pour les tokens.
 * @module models/Token
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Enumération représentant les différentes clés pour les tokens.
 */
export enum Keys {
  email = 'EMAIL',
  tel = 'TEL'
}

/**
 * Enumération représentant les différents objectifs pour les tokens.
 */
export enum Purposes {
  connection = 'CONNECTION',
  verification = 'VERIFICATION'
}

/**
 * Interface représentant un token dans la base de données.
 */
interface IToken extends Document {
  user?: mongoose.Types.ObjectId;
  key: Keys;
  token: string;
  validity: Date;
  purpose: Purposes;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les tokens.
 */
const tokenSchema: Schema<IToken> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  key: {
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
  purpose: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '48h' } // Supprime automatiquement les tokens après 48 heures
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

/**
 * Modèle mongoose pour les tokens.
 */
export const TokenModel = mongoose.model<IToken>("Tokens", tokenSchema);
