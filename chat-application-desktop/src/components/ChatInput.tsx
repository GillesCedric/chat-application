import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFaceSmile, faFile } from "@fortawesome/free-regular-svg-icons";

const ChatInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
    resetTextAreaToDefault(event);
  };

  return (
    <form onSubmit={handleSend} className="rounded-b-lg">
      <label htmlFor="chat" className="sr-only">
        Your message
      </label>
      <div className="flex items-center py-2 px-3 bg-gray-50 dark:bg-gray-700">
        <button
          type="submit"
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faFile} className="h-5" />
        </button>
        <button
          type="submit"
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faFaceSmile} className="h-5" />
        </button>
        <textarea
          id="chat"
          rows={4} // Change the initial rows to your desired height
          className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ resize: "none" }} // Disable resizing
        ></textarea>
        <button
          type="submit"
          className="inline-flex justify-center p-1 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
