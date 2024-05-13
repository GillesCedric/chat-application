import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NotificationIcon from "./NotificationIcon";
import NotificationRepository from "../modules/manager/NotificationRepository";
import { notify } from "./toastify";
import { ToastContainer } from "react-toastify";
import { NotificationDrawer } from "./NotificationDrawer";
import { Link, useNavigate } from "react-router-dom";
import {
  faBell,
  faHome,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import User from "../modules/manager/User";
import { useSocketContext } from "../context/SocketContext";
import { SocketKeywords } from "../utils/keywords";

const ChatHeader = () => {
  const [friendRequestCount, setFriendRequestsCount] = useState(0);
  const fetchFriendRequests = async () => {
    try {
      const response = await User.getFriendsRequests();
      if (response.message) {
        console.log(response);
        setFriendRequestsCount(response.data.length);
      } else {
        console.log(response.error);
        notify(response.error, "error");
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      notify(error, "error");
    }
  };
  const fetchNotifications = async () => {
    try {
      const response = await NotificationRepository.getNotifications();
      if (response.message) {
        console.log(response.data);
        setFriendRequestsCount(response.data.length);
      } else {
        console.log(response.error);
        notify(response.error, "error");
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      notify(error, "error");
    }
  };
  const { isConnected, subscribe, unsubscribe } = useSocketContext();

  useEffect(() => {
    fetchFriendRequests();
    fetchNotifications();
    const handleNewNotification = (data: any) => {
      fetchNotifications();
      fetchFriendRequests();
    };
    if (isConnected) {
      // S'abonner aux événements
      subscribe(SocketKeywords.newNotification, handleNewNotification);
      // Fonction de nettoyage pour se désabonner
      return () => {
        unsubscribe(SocketKeywords.newMessage, handleNewNotification);
      };
    }
  }, [isConnected, subscribe, unsubscribe]);

  const data: any[] = [];
  const [notifications, setNotifications] = useState([]);
  const [notificatonCount, setNotificationCount] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <header className="border-2 border-transparent bg-gray-50 text-black px-4 py-1 flex justify-between items-center">
      <Link className="flex items-center hover:cursor-pointer" to="/">
        <FontAwesomeIcon
          icon={faComments}
          className=" bg-blue-500 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 p-2 mr-2"
        />
        <span className="font-semibold">ChatBOT</span>
      </Link>
      <nav className="flex space-x-4 items-center justify-center">
        <Link
          className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          to="/"
          title="Home"
        >
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link
          className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          to="/friendsRequests"
          title="Friends requests"
        >
          <FontAwesomeIcon icon={faUsers} />
          <span className="sr-only">Notifications</span>
          {friendRequestCount > 0 && (
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
              {friendRequestCount}
            </div>
          )}
        </Link>
        <Link
          className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          to="/settings"
          title="User Profile"
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <NotificationIcon count={notificatonCount} onClick={toggleDrawer} />
        <NotificationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          initialNotifications={notificationsData}
          notificationCount={notificatonCount}
        />
      </nav>
    </header>
  );
};

const notificationsData = [
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

export default ChatHeader;
