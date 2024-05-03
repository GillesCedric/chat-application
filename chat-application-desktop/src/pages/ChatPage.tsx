import React, { useState, useEffect, useRef } from "react";
import ChatList from "../components/ChatList";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { ChatDataTest } from "../components/ChatDataTest";
import MessageListHeader from "../components/MessageListHeader";
import ChatHeader from "../components/ChatHeader";
import { SearchBar } from "../components/SearchBar";
import Socket from "../modules/socket/Socket";
import { friend } from "../components/FriendDataTest";
import { conversation } from "../components/ConversationDataTest";
import { useCheckOnlineStatus } from "../hooks/useCheckOnlineStatus";
import { notify } from "../components/toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OfflineBanner } from "../components/OfflineBanner";
import { EmptySection } from "../components/EmptySection";
import { AddFriend } from "../components/AddFriend";
import { useSocketListener } from "../hooks/useSocketListener";
import { SocketKeywords } from "../utils/keywords";
import User from "../modules/manager/User";
const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState<any[]>([]);

  const handleSendMessage = (newMessage: string) => {
    // Add new message to the messages state
    const newMsg = {
      id: messages.length + 1,
      content: newMessage,
      time: new Date().toLocaleTimeString(),
      isOwn: true,
    };
    setMessages([...messages, newMsg]);
  };

  const newConversation = useSocketListener(SocketKeywords.newConversation);
  const fetchConversations = () => {
    User.getConversations()
      .then((response: any) => {
        if (response) {
          console.log(response);
          setConversations(response.data);
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });
  }
  useEffect(() => {
    fetchConversations();
  }, [newConversation]);

  const [showBanner, setShowBanner] = useState(false);
  const isOnline = useCheckOnlineStatus();
  const wasOnlineRef = useRef(isOnline);
  useEffect(() => {
    if (wasOnlineRef.current !== isOnline) {
      if (!isOnline) {
        // If we've just gone offline
        setShowBanner(true);
      } else {
        // If we've just come back online
        setShowBanner(true);
        setTimeout(() => {
          // Hide the banner after 3 seconds
          setShowBanner(false);
        }, 3000);
      }
      // Update the reference to the current status for the next render
      wasOnlineRef.current = isOnline;
    }
  }, [isOnline]);

  return (
    <div className="flex flex-col h-screen">
      {showBanner && <OfflineBanner isOnline={isOnline} />}
      <ToastContainer />
      <div className="sticky top-0 z-10">
        <ChatHeader />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {conversations.length == 0 ? (
          <>
            <EmptySection />
          </>
        ) : (
          <>
            <aside
              className={`w-1/4 p-2 overflow-y-auto scrollbar justify-center items-center  ${conversations.length === 0 ? "" : "flex-none"
                }`}
            >
              <div className="sticky top-0">
                <SearchBar />
              </div>
              <ChatList conversations={conversations} />
            </aside>
            <main className="flex flex-col w-3/4 flex-1 p-2 overflow-hidden">
              <div className="flex-none">
                <MessageListHeader
                  name={friend.name}
                  isOnline={isOnline}
                  avatar={friend.avatar}
                />
              </div>

              <div className="flex-grow overflow-y-auto scrollbar-none">
                <MessageList messages={messages} />
              </div>

              <div className="flex-none">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
