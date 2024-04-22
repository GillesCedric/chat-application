import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
const NotificationIcon = ({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      onClick={onClick} // Use the passed onClick function to toggle the drawer
    >
      <FontAwesomeIcon icon={faBell} />
      <span className="sr-only">Notifications</span>
      {count > 0 && (
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
          {count}
        </div>
      )}
    </button>
  );
};

export default NotificationIcon;