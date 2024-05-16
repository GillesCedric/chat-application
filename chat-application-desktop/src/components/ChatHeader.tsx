/**
 *Ce composant représente l'en-tête. Il affiche le nom du chat ("ChatBOT") avec une icône de messagerie. Il contient également des liens de navigation vers différentes sections telles que la page d'accueil, les demandes d'amis, les contacts et les paramètres. De plus, il inclut une icône de notification qui ouvre un tiroir de notifications lorsqu'on clique dessus. Ce tiroir affiche une liste de notifications, telles que des succès, des erreurs ou des avertissements, avec leur état de lecture.
 *
 * @module components/ChatHeaders
 */

import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NotificationIcon from "./NotificationIcon";
import NotificationRepository, {
  NotificationModel,
} from "../modules/manager/NotificationRepository";
import { notify } from "./toastify";
import { NotificationDrawer } from "./NotificationDrawer";
import { Link, useNavigate } from "react-router-dom";
import { faGear, faHome, faUsers } from "@fortawesome/free-solid-svg-icons";
import User from "../modules/manager/User";
import { useSocketContext } from "../context/SocketContext";
import { SocketKeywords } from "../utils/keywords";
import { ToastContainer } from "react-toastify";
import { LogOutModal } from "./LogoutModal";

const ChatHeader = ({ csrfToken }: { csrfToken: string }) => {
  const [friendRequestCount, setFriendRequestsCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchFriendRequests = async () => {
    try {
      const response = await User.getFriendsRequests();
      if (response.message) {
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
      if (response.data) {
        /* console.log(response.data); */
        setNotifications(response.data);
        setNotificationsCount(response.data.length);
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
  const navigate = useNavigate();
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
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <ToastContainer />
      <header className="border-2 border-transparent bg-gray-50 text-black px-4 py-1 flex justify-between items-center">
        <Link className="flex items-center hover:cursor-pointer" to="/">
          <img width={40} height={40} alt="Chat Application Icon" src="chat-application.png" />
          <span className="font-semibold">Chat-Application</span>
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
          <NotificationIcon count={notificationsCount} onClick={toggleDrawer} />
          <Link
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            to="/settings"
            title="User Profile"
          >
            <FontAwesomeIcon icon={faGear} />
          </Link>
          <LogOutModal csrfToken={csrfToken} />
          <NotificationDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            initialNotifications={notifications}
            csrfToken= {csrfToken}
          />
        </nav>
      </header>
    </>
  );
};

export default ChatHeader;
