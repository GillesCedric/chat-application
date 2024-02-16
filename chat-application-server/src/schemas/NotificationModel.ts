import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversations', 
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true,
  },
  chat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chats', 
    },
  ],
});

export const NotificationModel = mongoose.model("Notifications", notificationSchema);
