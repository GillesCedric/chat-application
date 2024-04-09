import { faBell, faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
const NavLink = ({ children, href }: { children: any; href: string }) => {
  return (
    <a
      href={href}
      className=" relative inline-block transition-colors duration-300 ease-in-out hover:text-blue-500"
    >
      {children}
      <span className="text-white relative inline-block transition-colors duration-300 ease-in-out hover:text-blue-500"></span>
    </a>
  );
};
const ChatHeader = () => {
  return (
    <header className="border-2 border-transparent bg-gray-50 text-black px-4 py-1 flex justify-between items-center">
      <div className="flex items-center">
        <div className="">
          <FontAwesomeIcon
            icon={faComments}
            className="bg-blue-500 rounded-full p-2 mr-2"
          />
        </div>
        <span className="font-semibold text-lg">ChatBOT</span>
      </div>
      <nav className="flex space-x-4 text-sm">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/chat">Chat</NavLink>
        <NavLink href="/chat">Contacts</NavLink>
        <NavLink href="/chat">Settings</NavLink>
        <a href="/chat">
          <FontAwesomeIcon
            icon={faBell}
          />
        </a>
      </nav>
    </header>
  );
};

export default ChatHeader;
