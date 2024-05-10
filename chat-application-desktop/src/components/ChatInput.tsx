import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faFaceSmile,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import API from "../modules/api/API";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

function resetTextAreaToDefault(event: React.FormEvent): void {
  const textarea = event.currentTarget.querySelector("textarea");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.rows = 1;
  }
}

const textAreaAdjust = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
  const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
  const maxRowsHeight = lineHeight * 4;
  if (element.scrollHeight > maxRowsHeight) {
    element.style.height = `${maxRowsHeight}px`;
    element.style.overflowY = "auto";
  } else {
    element.style.overflowY = "hidden";
  }
};

const ChatInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string, csrfToken: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const csrfTokenRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    API.getCSRFToken().then((data) => {
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSend(event);
    }
  };

  const onEmojiClick = ( emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
    console.log(emojiObject); 
  };

  return (
    <form onSubmit={handleSend} className="rounded-b-lg">
      <input ref={csrfTokenRef} type="hidden" name="_csrf" value={csrfToken} />
      <div className="flex items-center py-2 px-3 bg-gray-50 dark:bg-gray-700">
        <button
          type="button"
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faFaceSmile} className="h-5" />
        </button>
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={(emojiObject: EmojiClickData ) => {onEmojiClick(emojiObject)}}
            style={{ position: "absolute", bottom: "50px", right: "20px" }}
          />
        )}
        <textarea
          id="chat"
          rows={1}
          className="focus:outline-none block scrollbar-none mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            textAreaAdjust(e.target);
          }}
          onKeyDown={handleKeyDown}
          style={{ resize: "none" }}
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
