/**
 * Ce composant représente l'en-tête. Il affiche le nom du chat ("ChatBOT") avec une icône de messagerie. 
 * Il contient également des liens de navigation vers différentes sections telles que la page d'accueil, 
 * les demandes d'amis, les contacts et les paramètres. De plus, il inclut une icône de notification 
 * qui ouvre un tiroir de notifications lorsqu'on clique dessus. Ce tiroir affiche une liste de notifications, 
 * telles que des succès, des erreurs ou des avertissements, avec leur état de lecture.
 * 
 * @module components/ChatHeaders
 */

import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NotificationIcon from "./NotificationIcon";
import NotificationRepository from "../modules/manager/NotificationRepository";
import { notify } from "./toastify";
import { ToastContainer } from "react-toastify";
import { NotificationDrawer } from "./NotificationDrawer";
import { useNavigate } from "react-router-dom";

/**
 * Composant ChatHeader.
 * 
 * @function ChatHeader
 * @returns {JSX.Element} Le composant ChatHeader.
 * 
 */
const ChatHeader = (): JSX.Element => {
  const data: any[] = [];
  const [notifications, setNotifications] = useState([]);
  const [notificatonCount, setNotificationCount] = useState(1);

  /*   useEffect(() => {
      NotificationRepository.getNotifications(data).then((response: any) => {
        if (response.message) {
          setNotifications(response.message);
          setNotificationCount(notifications.length);
        } else {
          notify(response.error, "error");
        }
      });
    }); */

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
        </Link>
        <Link
          className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          to="/Profile"
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

/**
 * Composant NavLink.
 * 
 * @function NavLink
 * @param {Object} props - Les propriétés du composant.
 * @param {any} props.children - Le contenu du lien.
 * @param {string} props.href - L'URL vers laquelle le lien pointe.
 * @returns {JSX.Element} Le composant NavLink.
 */
const NavLink = ({ children, href }: { children: any; href: string }): JSX.Element => {
  const navigate = useNavigate();
  return (
    <span
      onClick={() => navigate(href)}
      className="cursor-pointer relative inline-block ease-in-out group transition duration-300 hover:text-blue-500 cursor-pointer"
    >
      {children}
    </span>
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
