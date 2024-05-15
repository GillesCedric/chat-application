import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBroom } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "./Notification";
import { NotificationModel } from "../modules/manager/NotificationRepository";

export const NotificationDrawer = ({
  isOpen,
  onClose,
  initialNotifications,
}: {
  isOpen: boolean;
  onClose: any;
  initialNotifications: NotificationModel[];
}) => {
  const drawerRef = useRef(null);
  const [notifications, setNotifications] =
    useState<NotificationModel[]>(initialNotifications);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const handleClose = (e: any) => {
    if (drawerRef.current === e.target) {
      onClose();
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div
      ref={drawerRef}
      onClick={handleClose}
      className={`fixed inset-0 bg-black bg-opacity-15 backdrop-blur-lg transition-opacity z-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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

export const EmptySectionNotification = () => {
  return (
    <div className="w-full flex items-center flex-wrap justify-center gap-10 h-screen">
      <div className="grid gap-4 w-60">
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
  );
};
