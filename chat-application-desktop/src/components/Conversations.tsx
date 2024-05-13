import { Avatar } from "./Avatar";
import { ConversationModel } from "../modules/manager/ConversationRepository";
import { convertToDate, getDateDivider } from "../utils/utilsFunctions";
import { AddFriend } from "./AddFriend";
import API from "../modules/api/API";
import { useEffect, useState } from "react";

const ConversationItem = ({
  conversation,
  changeConversation,
  isSelected,
}: {

  conversation: ConversationModel;
  changeConversation: (
    conversation: ConversationModel ) => void;
  isSelected: boolean;
  }) => {
  const decryptedKey = window.electron.security.decryptWithPrivateKey(conversation.encryptedKey)
  return (
    <div
      className={`flex items-center px-4 py-3 text-black cursor-pointer rounded-md ${
        isSelected ? "bg-gray-300" : "hover:bg-gray-300"
      }`}
      onClick={() => changeConversation(conversation)}
    >
      <Avatar avatar={conversation.picture} fullname={conversation.fullname} />
      <div className="ml-4">
        <p className="font-semibold">{conversation.fullname}</p>
        <p className="text-grey-dark text-sm">
          {conversation.lastMessage.message ? window.electron.security.decryptWithSymmetricKey(conversation.lastMessage.message, decryptedKey) : null}
        </p>
      </div>
      <span className="ml-auto text-grey-dark text-sm">
        {getDateDivider(convertToDate(conversation.lastMessage.date))}
      </span>
      {conversation.unreadCount > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full ml-4">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
};

const Conversations = ({
  conversations,
  selectedConversation,
  changeConversation,
}: {
  conversations: ConversationModel[];
  selectedConversation: ConversationModel | null;
  changeConversation: (
    conversation: ConversationModel) => void;
}) => {
  return (
    <div className="w-70 z-10 relative">
      <div className="overflow-y-auto mt-3">
        {conversations.length > 0 ? (
          <>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isSelected={
                  selectedConversation
                    ? conversation._id === selectedConversation._id
                    : false
                }
                changeConversation={changeConversation}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Conversations;
