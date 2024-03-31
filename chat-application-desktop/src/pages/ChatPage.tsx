import React, { useState } from "react";
import ChatList from "../components/ChatList";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { ChatDataTest } from "../components/ChatDataTest";
import MessageListHeader from "../components/ChatHeader";
const ChatPage = () => {
  const [chats, setChats] = useState(ChatDataTest);
  const [messages, setMessages] = useState<any[]>([
    // Replace this with your actual message data
		{ id: 1, content: "Hello World", time: "10:00", isOwn: true },
		{ id: 2, content: "Hello World", time: "10:00", isOwn: false },
		{ id: 2, content: "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.", time: "10:00", isOwn: false },
		{ id: 2, content: "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.", time: "10:00", isOwn: true },
    // More messages...
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
    name: "Tata Cécile",
    isOnline: true, // this could be dynamic based on user status
    avatar:
      "https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg",
  };
  return (
    <div className="chat-page">
      <aside className="m-3">
        <ChatList chats={chats} />
      </aside>
      <main className="chat-area ml-5 rounded-xl">
        <MessageListHeader
          name={friend.name}
          isOnline={friend.isOnline}
          avatar={friend.avatar}
        />
        <MessageList messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default ChatPage;
