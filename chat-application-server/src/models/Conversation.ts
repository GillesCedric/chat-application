/**
 * Modèle pour les conversations.
@module models/Conversation
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface représentant une clé chiffrée dans la base de données.
 */
interface IEncryptedKey {
  user: mongoose.Types.ObjectId;
  encryptedKey: string;
}

/**
 * Interface représentant une conversation dans la base de données.
 */
interface IConversation extends Document {
  members: mongoose.Types.ObjectId[];
  encryptedKeys: IEncryptedKey[];
  chats: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les clés chiffrées.
 */
const encryptedKeySchema: Schema<IEncryptedKey> = new Schema({
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

/**
 * Schéma mongoose pour les conversations.
 */
const conversationSchema: Schema<IConversation> = new Schema({
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

/**
 * Middleware pour s'assurer de l'unicité des membres de la conversation et les trier par ID avant la sauvegarde.
 */
conversationSchema.pre('save', function (next) {
  // Assurer l'unicité des membres pour éviter les doublons
  this.members = Array.from(new Set(this.members));

  // Tri des membres par leur ID avant de sauvegarder la conversation
  this.members.sort();
  next();
});

/**
 * Modèle mongoose pour les conversations.
 */
export const ConversationModel = mongoose.model<IConversation>('Conversations', conversationSchema);
