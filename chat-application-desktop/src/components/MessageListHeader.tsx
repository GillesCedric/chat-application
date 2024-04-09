import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
const MessageListHeader = ({ name, isOnline, avatar } : {name : string , isOnline : boolean , avatar : string}) => {
  return (
    <div className=" rounded-t-lg py-2 px-3 bg-grey-lighter flex justify-between items-center border-b-2">
      <div className="flex items-center">
        <img className="w-10 h-10 rounded-full" src={avatar} alt={`${name}`} />
        <div className="ml-4">
          <p className="text-grey-darkest font-semibold">{name}</p>
          <p
            className={`text-grey-darker text-xs mt-1 ${
              isOnline ? "text-green-500" : "text-red-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
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
          {/* SVG icon or any other icon component */}
        </button>
      </div>
    </div>
  );
};

export default MessageListHeader;
