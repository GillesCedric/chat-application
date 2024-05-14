/**
 *Le module Notification est un composant React utilisé pour afficher une liste de notifications dans une application. Chaque notification est représentée par un élément de la liste, affichant un message et une icône correspondant à son type (succès, erreur, avertissement). Le composant permet à l'utilisateur d'interagir avec les notifications en les marquant comme lues ou en les supprimant. Lorsque l'utilisateur clique sur l'icône "Marquer comme lu", la notification correspondante est mise à jour pour indiquer qu'elle a été lue. De même, lorsque l'utilisateur clique sur l'icône "Supprimer", la notification est retirée de la liste. En résumé, ce composant offre une interface conviviale pour gérer les notifications de l'application de manière interactive.
 * 
 * @module components/Notification
 */
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getNotificationIcon } from "../utils/NotificationIcon";

export const Notification = ({
  notifications,
  setNotifications,
}: {
  notifications: any;
  setNotifications: any;
}) => {
  const handleDismiss = (id: any) => {
    const newNotifications = notifications.map((notification: any) =>
      notification.id === id ? { ...notification, unread: false } : notification
    );
    setNotifications(newNotifications);
  };

  return (
    <>
      {notifications.map((notification: any) => (
        <div
          key={notification.id}
          className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow ${notification.unread
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-white dark:bg-gray-800"
            }`}
          role="alert"
        >
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${notification.unread
                ? "text-white bg-blue-600"
                : "text-gray-400 bg-gray-200 dark:text-gray-500 dark:bg-gray-700"
              }`}
          >
            {getNotificationIcon(notification.type)}
          </div>
          <div className="ms-3 text-sm font-normal">{notification.message}</div>
          <div className="fex flex-c">

          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => handleDismiss(notification.id)}
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" title="Mark as read" />
          </button>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => handleDismiss(notification.id)}
          >
            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" title="Delete" />
          </button>
        </div>
      ))}
    </>
  );
};
