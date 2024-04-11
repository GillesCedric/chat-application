import React from "react";

const MessageList = ({ messages }: { messages: any[] }) => (
  <div className="flex flex-col space-y-2 p-3 overflow-y-auto bg-custom-gray">
    {messages.map((message, index) => (
      <MessageItem key={index} message={message} />
    ))}
  </div>
);

const MessageItem = ({ message }: { message: any }) => {
  const baseStyle =
    "rounded-2xl p-3 my-1 text-sm shadow max-w-[80%] min-w-[10%] break-words";
  const ownMessageStyle = "bg-custom-green text-black float-right clear-both";
  const otherMessageStyle = "bg-gray-100 text-gray-800 float-left clear-both";

  // A conditional style that applies different background and positioning based on the `isOwn` property
  const messageStyle = message.isOwn
    ? `${baseStyle} ${ownMessageStyle}`
    : `${baseStyle} ${otherMessageStyle}`;

  return (
    <div
      className={` ${
        message.isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div className={messageStyle}>
        <p>{message.content}</p>
        <span className="text-xs block text-right text-gray-400">{message.time}</span>
      </div>
    </div>
  );
};



export default MessageList;
