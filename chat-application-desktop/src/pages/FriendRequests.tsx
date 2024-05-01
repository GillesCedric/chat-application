import React, { useState } from "react";
import { FriendRequestComponent } from "../components/FriendRequestComponent";
import ChatHeader from "../components/ChatHeader";

export const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState(
    Array(5)
      .fill(null)
      .map((_, index) => ({
        id: index,
        sender: `Friend ${index + 1}`,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        createdAt: new Date().toISOString().slice(0, 10),
      }))
  );

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader />
      <div className="overflow-y-auto flex-grow scrollbar-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {friendRequests.map((request) => (
            <FriendRequestComponent key={request.id} friendRequest={request} />
          ))}
        </div>
      </div>
    </div>
  );
};
