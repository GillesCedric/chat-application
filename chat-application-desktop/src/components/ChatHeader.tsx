import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NotificationIcon from "./NotificationIcon";
import NotificationRepository from "../modules/manager/NotificationRepository";  
;
import { notify } from "./toastify";
import { ToastContainer } from "react-toastify";
import { NotificationDrawer } from "./NotificationDrawer";
import { useNavigate } from "react-router-dom";
const NavLink = ({ children, href }: { children: any; href: string }) => {
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

const ChatHeader = () => {
  const data: any[] = [];
  const [notifications, setNotifications] = useState([]);
  const [notificatonCount, setNotificationCount] = useState(1);
  useEffect(() => {
    NotificationRepository.getNotifications(data).then((response: any) => {
      if (response.message) {
        setNotifications(response.message);
        setNotificationCount(notifications.length);
      } else {
        notify(response.error, "error");
      }
    });
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <header className="border-2 border-transparent bg-gray-50 text-black px-4 py-1 flex justify-between items-center">
      <div className="flex items-center">
        <div className="">
          <FontAwesomeIcon
            icon={faComments}
            className="bg-blue-500 rounded-full p-2 mr-2"
          />
        </div>
        <span className="font-semibold">ChatBOT</span>
      </div>
      <nav className="flex space-x-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/friendsRequests">Friends Request</NavLink>
        <NavLink href="/chat">Contacts</NavLink>
        <NavLink href="/chat">Settings</NavLink>
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
