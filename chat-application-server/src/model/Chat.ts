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
    ref: 'User', 
    required: true,
  },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
