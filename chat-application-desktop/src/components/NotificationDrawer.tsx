/**
 * Le composant NotificationDrawer est une fonction React qui affiche un tiroir latéral dans une application.
 * Ce tiroir contient une liste de notifications, permettant à l'utilisateur de voir les dernières notifications reçues.
 * Il offre également des fonctionnalités pour marquer toutes les notifications comme lues ou pour effacer toutes les notifications d'un seul coup.
 * Le composant EmptySectionNotification est inclus pour afficher un message lorsque la liste de notifications est vide, indiquant à l'utilisateur qu'aucune nouvelle notification n'est disponible pour le moment.
 * En résumé, le NotificationDrawer offre une interface conviviale pour gérer les notifications de l'application de manière efficace.
 * 
 * @module components/NotificationDrawer
 */

import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBroom } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "./Notification";
import NotificationRepository, { NotificationModel } from "../modules/manager/NotificationRepository";
import { notify } from "./toastify";

/**
 * Propriétés pour le composant NotificationDrawer.
 * @typedef {Object} NotificationDrawerProps
 * @property {boolean} isOpen - Indique si le tiroir est ouvert.
 * @property {Function} onClose - Fonction à appeler pour fermer le tiroir.
 * @property {Array<Object>} initialNotifications - Liste initiale des notifications.
 * @property {number} notificationCount - Nombre de notifications non lues.
 */

/**
 * Composant NotificationDrawer.
 * @param {NotificationDrawerProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le tiroir de notifications.
 */
export const NotificationDrawer = ({
  isOpen,
  onClose,
  initialNotifications,
  csrfToken,
}: {
  isOpen: boolean;
  onClose: any;
  initialNotifications: NotificationModel[];
  csrfToken: string;
}) => {
  const drawerRef = useRef(null);
  const [notifications, setNotifications] =
    useState<NotificationModel[]>(initialNotifications);
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
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  /**
   * Gère la fermeture du tiroir lorsque l'utilisateur clique en dehors de celui-ci.
   * @param {React.MouseEvent} e - L'événement de clic.
   */
  const handleClose = (e: React.MouseEvent) => {
    if (drawerRef.current === e.target) {
      onClose();
    }
  };

  /**
   * Marque toutes les notifications comme lues.
   */
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification: any) => ({
      ...notification,
      unread: false,
    }));
    setNotifications(updatedNotifications);
  };

  /**
   * Efface toutes les notifications.
   */
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div
      ref={drawerRef}
      onClick={handleClose}
      className={`fixed inset-0 bg-black bg-opacity-15 backdrop-blur-lg transition-opacity z-50 ${isOpen ? " opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`flex flex-col justify-between fixed inset-y-0 right-0 p-4 overflow-y-auto bg-white dark:bg-gray-700 w-80 duration-700 transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-500"
        >
          <FontAwesomeIcon icon={faXmark} />
          <span className="sr-only">Close drawer</span>
        </button>
        {notifications.length === 0 ? (
          <EmptySectionNotification />
        ) : (
          <div className="scrollbar-none pt-10 pb-20 overflow-y-auto">
            <Notification
              notifications={notifications}
              setNotifications={setNotifications}
              csrfToken={csrfToken}
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-700">
          <button
            onClick={clearAllNotifications}
            className="justify-center inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
          >
            Clear All
            <FontAwesomeIcon icon={faBroom} className="w-3.5 h-3.5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant EmptySectionNotification.
 * Affiche un message lorsque la liste de notifications est vide.
 * @returns {JSX.Element} Élément JSX représentant l'état vide des notifications.
 */
export const EmptySectionNotification: React.FC = () => {
  return (
    <div className="w-full flex items-center flex-wrap justify-center gap-10 h-screen">
      <div className="grid gap-4 w-60">
        <img
          className="w-42 h-12 mx-auto"
          style={{ filter: "drop-shadow(2px 4px 6px gray)" }}
          src="https://static.vecteezy.com/system/resources/previews/021/975/474/original/no-notification-3d-render-icon-illustration-with-transparent-background-empty-state-png.png"
          alt="No notifications"
        />
        <div>
          <h2 className="text-center text-black text-xl font-semibold leading-loose pb-2">
            Notification center empty
          </h2>
          <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
            New notifications will appear here <br />
            stay tuned 🔔
          </p>
        </div>
      </div>
    </div>
  );
};
