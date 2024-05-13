import { MessageModel } from "../modules/manager/ConversationRepository";
import { EmptyCenterSection } from "./EmptyCenterSection";
import { DateDivider } from "./DateDivider";
import { convertToDate, getTime } from "../utils/utilsFunctions";
import { useEffect, useRef } from "react";

export const Conversation = ({ messages }: { messages: MessageModel[] }) => {
  const messagesEndRef = useRef(null)
  
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
          messages.map((message, index) => { 
            return (
              <div key={index}>
                {/* Check if it's the first message or if the date is different from the previous message */}
                {(index === 0 ||
                  new Date(messages[index - 1].createdAt).toDateString() !==
                  new Date(message.createdAt).toDateString()) && (
                    <DateDivider date={convertToDate(message.createdAt)} />
                  )}
                <MessageItem message={message} />
              </div>
            )
          })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageItem = ({ message }: { message: MessageModel }) => {
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
