import React from "react";
import { SearchBar } from "./SearchBar";
import { BEGINING_URL, AVATAR_DEFAULT } from "../utils/keywords";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
type Conversation = {
  _id: number;
  fullname: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadMessages: number;
};

/* _id: conversation._id,
          lastMessage: {
            date: conversation.lastMessageDate,
            message: conversation.lastMessageDetails && Crypto.decrypt(conversation.lastMessageDetails.message, "database")
          },
          unreadCount: conversation.unreadCount,
          username: Crypto.decrypt(conversation.memberDetails.username, "username"),
          picture: Crypto.decrypt(conversation.memberDetails.picture, "database"),
          status: Crypto.decrypt(conversation.memberDetails.status, "status"), */

const ChatListItem = ({ chat }: { chat: any }) => {
  return (
    <div className="flex items-center px-4 py-3 text-black hover:bg-grey-lighter cursor-pointer">
      {chat.picture === AVATAR_DEFAULT ? (
        <>
          <div className="relative w-10 h-10 overflow-hidden bg-white rounded-full dark:bg-gray-600">
            <svg
              className="absolute w-12 h-12 text-blue-600 -left-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
{/* 
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-white rounded-full dark:bg-gray-600">
            <span className="font-bold text-xl text-blue-700 dark:text-gray-300">JL</span>
          </div> */}
        </>
      ) : (
        <>
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={chat.picture}
            alt={`${chat.username}`}
          />
        </>
      )}

      <div className="ml-4">
        <p className=" font-semibold">{chat.username}</p>
        <p className="text-grey-dark text-sm">{chat.lastMessage.message}</p>
      </div>
      <span className="ml-auto text-grey-dark text-sm">
        {chat.lastMessage.date}
      </span>
      {chat.unreadCount > 0 && (
        <>
          <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full ml-4">
            {chat.unreadCount}
          </span>
        </>
      )}
    </div>
  );
};

const ChatList = ({ conversations }: { conversations: any }) => {
  /*  console.log(conversations.length);*/
  return (
    <div className="w-70 z-10 ">
      <div className="overflow-y-auto mt-3">
        {conversations.length > 0 ? (
          <>
            {conversations.map((chat: any) => (
              <ChatListItem key={chat._id} chat={chat} />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ChatList;
