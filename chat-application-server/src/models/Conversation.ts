import mongoose from "mongoose";

interface IEncryptedKey {
  user: mongoose.Types.ObjectId;
  encryptedKey: String;
}

interface IConversation extends mongoose.Document {
  members: mongoose.Types.ObjectId[];
  encryptedKeys: IEncryptedKey[];
  chats: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const encryptedKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  encryptedKey: {
    type: String,
    required: true
  },
});

const conversationSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  encryptedKeys: [encryptedKeySchema], // Stocke la clé de chiffrement chiffrée pour chaque utilisateur
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chats',
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

conversationSchema.pre('save', function (next) {
  // Assurer l'unicité des membres pour éviter les doublons
  this.members = Array.from(new Set(this.members));

  // Tri des membres par leur ID avant de sauvegarder la conversation
  this.members.sort();
  next();
});

export const ConversationModel = mongoose.model<IConversation>('Conversations', conversationSchema);
