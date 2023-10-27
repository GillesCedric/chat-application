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
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', 
    },
  ],
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

