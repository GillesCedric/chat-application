import mongoose from "mongoose";

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
  isVerified: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  ],
});

export const UserModel = mongoose.model("UserModel", userSchema);
