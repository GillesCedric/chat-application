import React, { useEffect, useState } from "react";
import { FriendRequestComponent } from "../components/FriendRequestComponent";
import ChatHeader from "../components/ChatHeader";
import User from "../modules/manager/User";

export const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    User.getFriendsRequests()
      .then((response: any) => {
        if (response.message) {
          setFriendRequests(response.message);
          console.log(response.message);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  });
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
