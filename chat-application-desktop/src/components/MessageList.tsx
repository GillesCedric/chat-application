import React from "react";
const MessageList = ({ messages }: { messages: any[] }) => (
  <div className="flex flex-col space-y-2 p-3 overflow-y-auto bg-custom-gray h-full">
    {messages.length === 0 ? (
      <div className="flex-grow flex items-center justify-center">
        <EmptySectionMessage/>
      </div>
    ) : (
      messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))
    )}
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

const EmptySectionMessage = () => {
  return (
    <>
      <div className="w-full flex items-center flex-wrap justify-center gap-10">
        <div className="grid gap-4 w-60 ">
          <img
            className="w-42 h-12 mx-auto"
            style={{ filter: "drop-shadow(2px 4px 6px gray)" }}
            src="https://cdn-icons-png.flaticon.com/512/2292/2292755.png"
            alt="no message"
          />
          <div>
            <h2 className="text-center text-black text-xl font-semibold leading-loose pb-2">
              Message center empty
            </h2>
            <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
              New messages will appear here <br />
              just type and send💬
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageList;
