/**
 * Le composant Conversation rend une liste de messages dans une interface de chat. 
 * Il prend en entrée une liste de messages et affiche chaque message dans un élément de liste. 
 * Le composant gère également le défilement automatique vers le bas lorsque de nouveaux messages sont ajoutés, 
 * garantissant une expérience de chat fluide. 
 * Si aucun message n'est présent, il affiche un message indiquant que la conversation est vide et encourage 
 * l'utilisateur à envoyer des messages.
 * 
 * @module components/Conversation
 */

import { MessageModel } from "../modules/manager/ConversationRepository";
import { EmptyCenterSection } from "./EmptyCenterSection";
import { DateDivider } from "./DateDivider";
import { convertToDate, getTime } from "../utils/utilsFunctions";
import { useEffect, useRef } from "react";

/**
 * Composant Conversation.
 * 
 * @function Conversation
 * @param {Object} props - Les propriétés du composant.
 * @param {MessageModel[]} props.messages - La liste des messages à afficher dans la conversation.
 * @returns {JSX.Element} Le composant Conversation.
 */
export const Conversation = ({ messages }: { messages: MessageModel[] }): JSX.Element => {
  const messagesEndRef = useRef(null);

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effet pour faire défiler vers le bas à chaque ajout de message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);  // Dépendance aux messages

  return (
    <div
      className="scrollbar-none flex flex-col space-y-2 p-3 overflow-y-auto  h-full"
      style={{
        backgroundImage: `url("https://c1.wallpaperflare.com/preview/481/732/904/paper-wrinkled-white-cute.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {messages.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <EmptyCenterSection
            message="Your chat is desolate 😓"
            smallParagraph="Go ahead! Send some messages."
          />
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={index}>
            {/* Vérifie s'il s'agit du premier message ou si la date est différente du message précédent */}
            {(index === 0 ||
              new Date(messages[index - 1].createdAt).toDateString() !==
              new Date(message.createdAt).toDateString()) && (
                <DateDivider date={convertToDate(message.createdAt)} />
              )}
            <MessageItem message={message} />
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

/**
 * Composant MessageItem.
 * 
 * @function MessageItem
 * @param {Object} props - Les propriétés du composant.
 * @param {MessageModel} props.message - Le message à afficher.
 * @returns {JSX.Element} Le composant MessageItem.
 */
const MessageItem = ({ message }: { message: MessageModel }): JSX.Element => {
  const baseStyle =
    "rounded-2xl p-3 my-1 text-sm shadow max-w-[80%] min-w-[10%] break-words";
  const ownMessageStyle = "bg-custom-green text-black float-right clear-both";
  const otherMessageStyle = "bg-gray-100 text-gray-800 float-left clear-both";

  const messageStyle = message.isOwnedByUser
    ? `${baseStyle} ${ownMessageStyle}`
    : `${baseStyle} ${otherMessageStyle}`;

  return (
    <div
      className={`flex ${message.isOwnedByUser ? "justify-end" : "justify-start"
        }`}
    >
      <div className={messageStyle}>
        <p>{message.message}</p>
        <span className="text-xs block text-right text-gray-400">
          {getTime()}
        </span>
      </div>
    </div>
  );
};
