import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
    },
  ], // An array of members, where each member is represented as an object
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatModel',
    },

  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    type: String, // User ID of the user who deleted the conversation
  },
});

export const ConversationModel = mongoose.model('ConversationModel', conversationSchema);
