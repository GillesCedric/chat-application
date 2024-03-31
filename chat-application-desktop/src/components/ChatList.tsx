import React from "react";
import { SearchBar } from "./SearchBar";
type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
	time: string;
};

const ChatListItem = ({ chat } : {chat : Chat}) => {
  return (
    <div className="flex items-center px-4 py-3 text-black hover:bg-grey-lighter cursor-pointer">
      <img
        className="h-12 w-12 rounded-full object-cover"
        src={chat.avatar}
        alt={`${chat.name}`}
      />
      <div className="ml-4">
        <p className=" font-semibold">{chat.name}</p>
        <p className="text-grey-dark text-sm">{chat.lastMessage}</p>
      </div>
      <span className="ml-auto text-grey-dark text-sm">{chat.time}</span>
			<span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full ml-4">
			5	
      </span>
    </div>
  );
};

const ChatList = ({ chats } : {chats : Chat[]}) => {
  return (
		<div className="w-80">
			<SearchBar/>
      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
