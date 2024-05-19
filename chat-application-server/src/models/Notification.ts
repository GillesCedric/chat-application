/**
 * Modèle pour les notifications.
 * @module models/Notification
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Enumération représentant les différents statuts d'une notification.
 */
export enum NotificationStatus {
  pending = 'PENDING',
  deleted = 'DELETED'
}

/**
 * Interface représentant une notification dans la base de données.
 */
interface INotification extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schéma mongoose pour les notifications.
 */
const notificationSchema: Schema<INotification> = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(NotificationStatus), // Assure que le statut est l'une des valeurs de l'énumération NotificationStatus
    default: NotificationStatus.pending // Valeur par défaut pour le statut
  },
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
 * Modèle mongoose pour les notifications.
 */
export const NotificationModel = mongoose.model<INotification>("Notifications", notificationSchema);
