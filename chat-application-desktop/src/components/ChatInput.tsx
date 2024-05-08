import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFaceSmile, faFile } from "@fortawesome/free-regular-svg-icons";
import API from "../modules/api/API";

function resetTextAreaToDefault(event: React.FormEvent): void {
  const textarea = event.currentTarget.querySelector("textarea");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.rows = 1;
  }
}

// Function to adjust the textarea height while typing
const textAreaAdjust = (element: HTMLTextAreaElement) => {
  // First, reset the height to 'auto' to shrink as content is deleted
  element.style.height = "auto";
  // Then set it to the actual scroll height
  element.style.height = `${element.scrollHeight}px`;

  // Calculate maximum height for 3 rows
  const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
  const maxRowsHeight = lineHeight * 4;

  if (element.scrollHeight > maxRowsHeight) {
    element.style.height = `${maxRowsHeight}px`;
    element.style.overflowY = "auto"; // Enable scrolling
  } else {
    element.style.overflowY = "hidden"; // Hide scrollbar when not needed
  }
};

const ChatInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string , csrfToken : string) => void;
}) => {
  const [message, setMessage] = useState("");
const [csrfToken, setCsrfToken] = useState("");
const csrfTokenRef = useRef<HTMLInputElement | null>(null);
useEffect(() => {
  API.getCSRFToken().then((data: any) => {
    setCsrfToken(data.token);
  });
}, []);
  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message, csrfToken);
      setMessage("");
    }
    resetTextAreaToDefault(event);
  };

  return (
    <form onSubmit={handleSend} className="rounded-b-lg">
      <input ref={csrfTokenRef} type="hidden" name="_csrf" value={csrfToken} />
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
          rows={1} // Change the initial rows to your desired height
          className=" focus:outline-none block scrollbar-none mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value), textAreaAdjust(e.target);
          }}
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
