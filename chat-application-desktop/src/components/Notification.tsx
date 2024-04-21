import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

  const getNotificationIcon = (type: any) => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {notifications.map((notification: any) => (
        <div
          key={notification.id}
          className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow ${
            notification.unread
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-white dark:bg-gray-800"
          }`}
          role="alert"
        >
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
              notification.unread
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
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" title="Mark as read"/>
          </button>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => handleDismiss(notification.id)}
          >
            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" title="Delete"/>
          </button>
        </div>
      ))}
    </>
  );
};
