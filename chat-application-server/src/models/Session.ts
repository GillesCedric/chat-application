import mongoose from "mongoose";

interface ISession extends mongoose.Document {
  userAgent: string
  token: string
  validity: Date
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema({
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
    index: {expires: '48h'}
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Gère automatiquement les champs createdAt et updatedAt
});

export const SessionModel = mongoose.model<ISession>("Sessions", sessionSchema);
