import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation', 
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  chat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', 
    },
  ],
});

export const Notification = mongoose.model("Notification", notificationSchema);
