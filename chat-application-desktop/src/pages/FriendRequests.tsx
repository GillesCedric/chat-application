import React, { useEffect, useState } from "react";
import { FriendRequestComponent } from "../components/FriendRequestComponent";
import ChatHeader from "../components/ChatHeader";
import User from "../modules/manager/User";
import { useSocketListener } from "../hooks/useSocketListener"; // Make sure the path is correct
import { SocketKeywords } from "../utils/keywords";
import { EmptyFriendRequest } from "../components/EmptyFriendRequest";

export const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const hasNewFriendRequest = useSocketListener(SocketKeywords.newNotification);
  const fetchFriendRequests = async () => {
    try {
      const response = await User.getFriendsRequests();
      if (response && response.data) {
        setFriendRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, [hasNewFriendRequest]); // Re-fetch when new notifications arrive

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader />
      <div className="m-4">
        <div className=" text-lg font-extrabold text-gray-900 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Friends requests
          </span>{" "}
          center
        </div>
          <p className=" text-wrap text-xs font-normal text-gray-500 dark:text-gray-400">
            Here you can manage all your friends request, it's better to respond
            to all of them, either by accepting or rejecting.
          </p>
      </div>
      <div className="overflow-y-auto flex-grow">
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">

              <FriendRequestComponent
                key={request.id}
                friendRequest={request}
                />
                </div>
            ))
          ) : (
              <EmptyFriendRequest/>
          )}
      </div>
    </div>
  );
};
