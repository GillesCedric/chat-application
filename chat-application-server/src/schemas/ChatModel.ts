import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel', 
    required: true,
  },
});

export const ChatModel = mongoose.model('ChatModel', chatSchema);
