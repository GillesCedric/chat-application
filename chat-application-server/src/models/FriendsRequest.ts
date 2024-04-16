import mongoose from "mongoose";

export enum NotificationStatus {
  pending = 'PENDING',
  accepted = 'ACCEPTED',
  rejected = 'REJECTED'
}

interface IFriendsRequest extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  comment: string
  status: string
  createdAt: Date;
  updatedAt: Date;
}

const friendsRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
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

friendsRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export const FriendsRequestModel = mongoose.model<IFriendsRequest>("FriendsRequest", friendsRequestSchema);
