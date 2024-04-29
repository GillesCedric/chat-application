import { Crypto } from "../modules/crypto/Crypto";
import mongoose from "mongoose";

export enum UserStatus {
  online = 'ONLINE',
  offline = 'OFFLINE'
}

interface IUser extends mongoose.Document {
  lastname: string;
  firstname: string;
  username: string;
  tel: string;
  email: string;
  password: string;
  isEmailVerified: string;
  isTelVerified: string;
  is2FAEnabled: string;
  twoFASecret: string;
  twoFASecretExpiration: Date;
  picture: string;
  status: string
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tel: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: String,
    required: true,
  },
  isTelVerified: {
    type: String,
    required: true,
  },
  is2FAEnabled: {
    type: String,
    required: true,
  },
  twoFASecret: {
    type: String,
    required: false
  },
  twoFASecretExpiration: {
    type: Date,
    required: false
  },
  picture: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      default: []
    },
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

export const UserModel = mongoose.model<IUser>("Users", userSchema);
