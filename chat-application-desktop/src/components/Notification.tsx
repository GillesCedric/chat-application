/**
 * @module components/Notification
 * @description
 * Le module Notification est un composant React utilisé pour afficher une liste de notifications dans une application.
 * Chaque notification est représentée par un élément de la liste, affichant un message et une icône correspondant à son type (succès, erreur, avertissement).
 * Le composant permet à l'utilisateur d'interagir avec les notifications en les marquant comme lues ou en les supprimant.
 * Lorsque l'utilisateur clique sur l'icône "Marquer comme lu", la notification correspondante est mise à jour pour indiquer qu'elle a été lue.
 * De même, lorsque l'utilisateur clique sur l'icône "Supprimer", la notification est retirée de la liste.
 * En résumé, ce composant offre une interface conviviale pour gérer les notifications de l'application de manière interactive.
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getNotificationIcon } from "../utils/NotificationIcon";
import NotificationRepository, {
  NotificationModel,
} from "../modules/manager/NotificationRepository";
import { NotificationStatus } from "../utils/keywords";
import { formatDate } from "../utils/utilsFunctions";
import { notify } from "./toastify";

/**
 * Propriétés du composant Notification.
 * @typedef {Object} NotificationProps
 * @property {Array<Object>} notifications - Les notifications à afficher.
 * @property {Function} setNotifications - Fonction pour mettre à jour les notifications.
 */

/**
 * Composant de notification.
 * @param {NotificationProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant la liste des notifications.
 */
export const Notification = ({
  notifications,
  setNotifications,
  csrfToken,
}: {
  notifications: NotificationModel[];
  setNotifications: any;
  csrfToken: string;
}) => {
  const fetchNotifications = async () => {
    try {
      const response = await NotificationRepository.getNotifications();
      if (response.data) {
        setNotifications(response.data);
      } else {
        console.log(response.error);
        notify(response.error, "error");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      notify(error, "error");
    }
  };

  /**
 * Gère le clic sur l'icône "Marquer comme lu" pour une notification donnée.
 * @param {number} id - L'identifiant de la notification à marquer comme lue.
 */
  const handleDismiss = (id: string) => {
    const newNotifications = notifications.map((notification: any) =>
      notification._id === id
        ? { ...notification, unread: false }
        : notification
    );
    setNotifications(newNotifications);
    NotificationRepository.updateNotifications(id, { _csrf: csrfToken })
      .then((response: any) => {
        if (response.message) {
          fetchNotifications();
        }
        if (response.error) {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });
  };

  

  return (
    <>
      {notifications.map((notification: NotificationModel) => (
        <div
          key={notification._id}
          className={`relative flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow ${
            notification.status === NotificationStatus.pending
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-white dark:bg-gray-800"
          }`}
          role="alert"
        >
          <span className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
            {formatDate(notification.createdAt)}
          </span>
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
              notification.status === NotificationStatus.pending
                ? "text-white bg-blue-600"
                : "text-gray-400 bg-gray-200 dark:text-gray-500 dark:bg-gray-700"
            }`}
          >
            {getNotificationIcon("warning")}
          </div>
          <div className="ms-3 text-sm font-normal py-1">
            {notification.content}
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => handleDismiss(notification._id)}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="w-5 h-5 mt-1"
              title="Delete"
            />
          </button>
        </div>
      ))}
    </>
  );
};
