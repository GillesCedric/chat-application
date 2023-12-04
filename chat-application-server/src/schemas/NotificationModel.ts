import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConversationModel', 
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel', 
    required: true,
  },
  chat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatModel', 
    },
  ],
});

export const NotificationModel = mongoose.model("NotificationModel", notificationSchema);
