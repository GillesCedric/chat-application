import React, { useState } from "react";
import ChatList from "../components/ChatList";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { ChatDataTest } from "../components/ChatDataTest";
import MessageListHeader from "../components/MessageListHeader";
import ChatHeader from "../components/ChatHeader";
import { SearchBar } from "../components/SearchBar";
import Socket from "../modules/socket/Socket";
const ChatPage = () => {

  //Socket connection to the server
  Socket.connect()

  const [chats, setChats] = useState(ChatDataTest);
  const [messages, setMessages] = useState<any[]>([
    // Replace this with your actual message data
    { id: 1, content: "Hello World", time: "10:00", isOwn: true },
    { id: 2, content: "Hello World", time: "10:00", isOwn: false },
    {
      id: 2,
      content:
        "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.",
      time: "10:00",
      isOwn: false,
    },
    {
      id: 2,
      content:
        "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.",
      time: "10:00",
      isOwn: true,
    },
  ]);

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

  const friend = {
    name: "Yumilys✨",
    isOnline: true,
    avatar:
      "https://i.pinimg.com/736x/75/0e/16/750e1674e3801c6eeba5a8ca12d97df2.jpg",
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <ChatHeader />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List Sidebar */}
        <aside className="w-1/4 flex-none p-2 overflow-y-auto scrollbar  scrollbar-corner-rose-800">
          <div className="sticky top-0 z-40">
            <SearchBar />
          </div>
          <ChatList chats={chats} />
        </aside>

        {/* Chat Area */}
        <main className="flex flex-col w-3/4 flex-1 p-2 overflow-hidden">
          {/* Message List Header */}
          <div className="flex-none">
            <MessageListHeader
              name={friend.name}
              isOnline={friend.isOnline}
              avatar={friend.avatar}
            />
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto  scrollbar-none">
            <MessageList messages={messages} />
          </div>

          {/* Chat Input */}
          <div className="flex-none">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
