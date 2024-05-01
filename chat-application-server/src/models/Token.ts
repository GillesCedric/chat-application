import mongoose from "mongoose";

export enum Keys {
  email = 'EMAIL',
  tel = 'TEL'
}

export enum Purposes {
  connection = 'CONNECTION',
  verification = 'VERIFICATION'
}

interface IToken extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  key: string
  token: string
  validity: Date
  purpose: string
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new mongoose.Schema({
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
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

export const TokenModel = mongoose.model<IToken>("Tokens", tokenSchema);
