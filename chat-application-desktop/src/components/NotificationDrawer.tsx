/**
 *Le composant NotificationDrawer est une fonction React qui affiche un tiroir latéral dans une application.Ce tiroir contient une liste de notifications, permettant à l'utilisateur de voir les dernières notifications reçues. Il offre également des fonctionnalités pour marquer toutes les notifications comme lues ou pour effacer toutes les notifications d'un seul coup.Le composant EmptySectionNotification est inclus pour afficher un message lorsque la liste de notifications est vide, indiquant à l'utilisateur qu'aucune nouvelle notification n'est disponible pour le moment. En résumé, le NotificationDrawer offre une interface conviviale pour gérer les notifications de l'application de manière efficace.
 * 
 * @module components/NotificationDrawer
 */

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBroom } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "./Notification";

export const NotificationDrawer = ({
  isOpen,
  onClose,
  initialNotifications,
  notificationCount,
}: {
  isOpen: boolean;
  onClose: any;
  initialNotifications: any;
  notificationCount: any;
}) => {
  const drawerRef = useRef();
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleClose = (e: any) => {
    if (drawerRef.current === e.target) {
      onClose();
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification: any) => ({
      ...notification,
      unread: false,
    }));
    setNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div
      ref={drawerRef}
      onClick={handleClose}
      className={`fixed inset-0 bg-black bg-opacity-15 backdrop-blur-lg transition-opacity z-50 ${isOpen ? " opacity-100  " : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`flex flex-col justify-between fixed inset-y-0 right-0 p-4 overflow-y-auto bg-white dark:bg-gray-700 w-80 duration-700 transition-transform transform ${isOpen ? "translate-x-0" : "translate-x-full"
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
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-700">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Mark all as read
          </button>
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

export const EmptySectionNotification = () => {
  return (
    <>
      <div className="w-full flex items-center flex-wrap justify-center gap-10 h-screen">
        <div className="grid gap-4 w-60 ">
          <img
            className="w-42 h-12 mx-auto"
            style={{ filter: "drop-shadow(2px 4px 6px gray)" }}
            src="https://static.vecteezy.com/system/resources/previews/021/975/474/original/no-notification-3d-render-icon-illustration-with-transparent-background-empty-state-png.png"
            alt="belt"
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
    </>
  );
};
