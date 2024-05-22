/**
 * Ce module contient les données de notifications pour l'application.
 * Ces données sont utilisées pour afficher des notifications à l'utilisateur.
 * Chaque notification a un identifiant unique, un type (success, error, warning), un message et un indicateur de lecture.
 * 
 * @module components/NotifData
 */

/**
 * Interface décrivant une notification.
 */
interface Notification {
  /** Identifiant unique de la notification. */
  id: number;
  /** Type de la notification (success, error, warning). */
  type: "success" | "error" | "warning";
  /** Message de la notification. */
  message: string;
  /** Indicateur de lecture de la notification. */
  unread: boolean;
}

/** 
 * Tableau contenant les données de notifications.
 * @remarks Les notifications peuvent être de trois types : success, error, warning.
 */
const notificationsData: Notification[] = [
  {
    id: 1,
    type: "success",
    message: "Your file was uploaded successfully!",
    unread: true,
  },
  {
    id: 2,
    type: "error",
    message: "Failed to process your request. Please try again.",
    unread: true,
  },
  {
    id: 3,
    type: "warning",
    message: "Your subscription is about to expire.",
    unread: true,
  },
  {
    id: 4,
    type: "success",
    message: "Your settings have been saved.",
    unread: false,
  },
  {
    id: 5,
    type: "error",
    message: "There was a problem with your payment.",
    unread: false,
  },
  {
    id: 6,
    type: "warning",
    message: "You have used 90% of your data limit.",
    unread: true,
  },
  {
    id: 7,
    type: "success",
    message: "Your account has been updated successfully.",
    unread: false,
  },
];

export default notificationsData;
