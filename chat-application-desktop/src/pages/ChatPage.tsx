import React, { useState, useEffect, useRef } from "react";
import Conversations from "../components/Conversations";
import { Conversation } from "../components/Conversation";
import ChatInput from "../components/ChatInput";
import { ChatDataTest } from "../components/ChatDataTest";
import ConversationHeader from "../components/ConversationHeader";
import ChatHeader from "../components/ChatHeader";
import { SearchBar } from "../components/SearchBar";
import Socket from "../modules/socket/Socket";
import { friend } from "../components/FriendDataTest";
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
import { EmptyCenterSection } from "../components/EmptyCenterSection";
import ConversationRepository, {
  MessageModel,
} from "../modules/manager/ConversationRepository";
import { ConversationModel } from "../modules/manager/ConversationRepository";
import { convertToYesterday } from "../utils/utilsFunctions";
import { useSocketContext } from "../context/SocketContext";
import API from "../modules/api/API";
const ChatPage = () => {
  const [conversations, setConversations] = useState<ConversationModel[]>([]);
  const newConversation = useSocketListener(SocketKeywords.newConversation);
  const newMessage = useSocketListener(SocketKeywords.newMessage);
  const [showBanner, setShowBanner] = useState(false);
  const isOnline = useCheckOnlineStatus();
  const wasOnlineRef = useRef(isOnline);
  const [messsages, setMessages] = useState<MessageModel[]>([]);
  const [conversation, setConversation] = useState<ConversationModel>(null);
  const { isConnected, subscribe, unsubscribe } = useSocketContext();

  useEffect(() => {
    fetchConversations();

    const handleNewMessage = (data: any) => {
      console.log(data);
      addMessage();
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const handleNewConversation = (data: any) => {
      console.log(data);
      fetchConversations();
    };

    if (isConnected) {
      // S'abonner aux événements
      subscribe(SocketKeywords.newMessage, handleNewMessage);
      subscribe(SocketKeywords.newConversation, handleNewConversation);

      // Fonction de nettoyage pour se désabonner
      return () => {
        unsubscribe(SocketKeywords.newMessage, handleNewMessage);
        unsubscribe(SocketKeywords.newConversation, handleNewConversation);
      };
    }
  }, [isConnected, subscribe, unsubscribe]); // Réexécute l'effet seulement quand Socket.socket change

  const handleSendMessage = (newMessage: string, csrfToken: string) => {
    if (conversation === null) {
      notify("Error sending message, cannot get conversation", "error");
      return;
    }
    // Add new message to the messages state
    ConversationRepository.addMessage(conversation._id, {
      message: newMessage,
      _csrf: csrfToken,
    });
  };
  const [csrfToken, setCsrfToken] = useState("");

  const handleSelectConversation = (conversation: ConversationModel): void => {
    setConversation(conversation);
    ConversationRepository.getUserConversation(conversation._id)
      .then((response: any) => {
        if (!response.error) {
          console.log("Messages : " + response.data.length);
          console.log(
            response.data.map((data: any) => {
              console.log(data);
            })
          );
          setMessages(response.data);
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });
    API.getCSRFToken().then((data: any) => {
      setCsrfToken(data.token);
      console.log(csrfToken);
    });
    ConversationRepository.updateChat(conversation._id, csrfToken)
      .then((response) => {
        console.log(response);
        if (response.error) {
          notify("Error reading messages : " + response.error);
        }
      })
      .catch((error) => {
        notify("Error reading messages : " + error);
      });
  };
  useEffect(() => {
    API.getCSRFToken().then((data: any) => {
      setCsrfToken(data.token);
      console.log(csrfToken);
    });
  }, []);
  const fetchConversations = () => {
    ConversationRepository.getConversations()
      .then((response: any) => {
        console.log(response);
        if (!response.error) {
          setConversations(response.data);
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });
  };
  const addMessage = () => {
    notify("New message received", "info");
  };

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
              className={`overflow-y-auto w-1/4 scrollbar justify-center items-center p-2 border-grey-lighter shadow-sm  bg-white ${
                conversations.length === 0 ? "" : "flex-none"
              }`}
            >
              <div className="sticky top-0 z-50">
                <SearchBar />
              </div>
              <Conversations
                conversations={conversations}
                changeConversation={handleSelectConversation}
                selectedConversation={conversation}
              />
              <div className="absolute bottom-0 left-0 p-4">
                <AddFriend />
              </div>
            </aside>
            {conversation === null ? (
              <>
                <EmptyCenterSection
                  message="No conversation selected"
                  smallParagraph="Please choose a connvsersation in your left and click on it to start chating 😉"
                />
              </>
            ) : (
              <>
                <main className="flex flex-col w-3/4 flex-1 overflow-hidden bg-white">
                  <div className="flex-none">
                    <ConversationHeader
                      name={conversation.fullname}
                      status={true}
                      avatar={conversation.picture}
                    />
                  </div>

                  <div className="flex-grow overflow-y-auto scrollbar-none">
                    <Conversation messages={messsages} />
                  </div>

                  <div className="flex-none bg-white">
                    <ChatInput onSendMessage={handleSendMessage} />
                  </div>
                </main>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
