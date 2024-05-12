import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "./Avatar";
const MessageListHeader = ({ name, status, avatar } : {name : string , status : boolean , avatar : string}) => {
  return (
    <div className=" rounded-t-lg py-2 px-3 bg-white flex justify-between items-center border-b-2">
      <div className="flex items-center">
        <Avatar avatar={avatar} fullname={name} />
        <div className="ml-4">
          <p className="text-grey-darkest font-semibold">{name}</p>
          <p
            className={`text-grey-darker text-xs ${
              status ? "text-green-700" : "text-red-500"
            }`}
          >
            {status ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
        >
        </button>
      </div>
    </div>
  );
};

export default MessageListHeader;
