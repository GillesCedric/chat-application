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
import { useCheckOnlineStatus } from "../Hooks/useCheckOnlineStatus";
import { notify } from "../components/toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OfflineBanner } from "../components/OfflineBanner";
import { EmptySection } from "../components/EmptySection";
import { AddFriend } from "../components/AddFriend";
import MyComponent from "../components/Test";
import UserRepository from "../modules/repository/UserRepository";
const ChatPage = () => {

  //Socket connection to the server
  Socket.connect()

  const [chats, setChats] = useState(ChatDataTest);
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

  /* useEffect(() => {
    const data = {
      username : "lilo"
    };
    UserRepository.getUsersFriends(data).
      then((response) => {
        if (response.message) {
          setChats(response.message);
        }
        else {
          notify("Failed to load user's chat list " , "error");
        }
      }).
      catch((error) => {
        notify("Failed to load user's chat list" , "error");
        console.log(error);
      })
  },[chats]) */
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
      {/* <MyComponent /> */}
      <div className="sticky top-0 z-10">
        <ChatHeader />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {chats.length === 0 ? (
          <>
            <EmptySection />
          </>
        ) : (
          <>
            <aside
              className={`w-1/4 p-2 overflow-y-auto scrollbar justify-center items-center  ${
                chats.length === 0 ? "" : "flex-none"
              }`}
            >
              <div className="sticky top-0">
                <SearchBar />
              </div>
              <ChatList chats={chats} />
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
