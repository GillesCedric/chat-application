import mongoose from "mongoose";

interface IBlacklistedToken extends mongoose.Document {
  token: string 
  createdAt: Date;
  updatedAt: Date;
}

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '7d' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

export const BlacklistedTokenModel = mongoose.model<IBlacklistedToken>("BlacklistedTokens", blacklistedTokenSchema);
