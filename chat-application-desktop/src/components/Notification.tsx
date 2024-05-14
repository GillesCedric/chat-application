import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getNotificationIcon } from "../utils/NotificationIcon";
import { NotificationModel } from "../modules/manager/NotificationRepository";
import { NotificationStatus } from "../utils/keywords";
import { formatDate } from "../utils/utilsFunctions";

export const Notification = ({
  notifications,
  setNotifications,
}: {
  notifications: NotificationModel[];
  setNotifications: any;
}) => {
  const handleDismiss = (id: string) => {
    const newNotifications = notifications.map((notification: any) =>
      notification._id === id ? { ...notification, unread: false } : notification
    );
    setNotifications(newNotifications);
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
            {formatDate( notification.createdAt)}
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
          <div className="ms-3 text-sm font-normal">{notification.content}</div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
            onClick={() => handleDismiss(notification._id)}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="w-5 h-5"
              title="Delete"
            />
          </button>
        </div>
      ))}
    </>
  );
};
