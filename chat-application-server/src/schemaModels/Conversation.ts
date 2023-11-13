import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ], // An array of members, where each member is represented as an object
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
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

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
