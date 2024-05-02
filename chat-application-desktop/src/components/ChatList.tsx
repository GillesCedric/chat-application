import React from "react";
import { SearchBar } from "./SearchBar";
type Conversation = {
  _id: number;
  fullname: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadMessages:number
};

const ChatListItem = ({ chat } : {chat : any}) => {
  return (
    <div className="flex items-center px-4 py-3 text-black hover:bg-grey-lighter cursor-pointer">
      <img
        className="h-12 w-12 rounded-full object-cover"
        src={chat.avatar}
        alt={`${chat.firstname}`}
      />
      <div className="ml-4">
        <p className=" font-semibold">{chat.username}</p>
        <p className="text-grey-dark text-sm">{chat.lastMessage}</p>
      </div>
      <span className="ml-auto text-grey-dark text-sm">{chat.time}</span>
      {chat.unreadMessages > 0 && (
        <>
          <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full ml-4">
            {chat.unreadMessages}
          </span>
        </>
      )}
    </div>
  );
};

const ChatList = (chats:any) => {
  return (
    <div className="w-70 z-10 ">
      <div className="overflow-y-auto mt-3">
        {chats.length > 0 ? (
          <>
            {chats.map((chat: any) => (
              <ChatListItem key={chat.id} chat={chat} />
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
