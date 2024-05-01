import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import User from "../modules/manager/User";
import { FriendsRequestStatus } from "../utils/keywords";
import { notify } from "./toastify";

export const FriendRequestComponent = ({
  friendRequest,
}: {
  friendRequest: any;
}) => {
  const friendRequestId: string = friendRequest._id;
  const handleAccept = () => {
    const data = {
      status: FriendsRequestStatus.accepted,
    }
    User.updateFriendRequest(friendRequestId ,data )
      .then((response: any) => {
        if (response.message) {
          console.log(response.message);
        } else {
          notify(response.message, "error");
        }
      })
      .catch((error: any) => {
        console.log(error);
        notify("An error occur !", "error");
      });
  };

  const handleDelete = () => {
    User.updateFriendRequest(friendRequestId, {
      status: FriendsRequestStatus.deleted,
    })
      .then((response: any) => {
        if (response.message) {
          console.log(response.message);
        } else {
          console.log(response.error);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleReject = () => {
    User.updateFriendRequest(friendRequestId, {
      status: FriendsRequestStatus.rejected,
    })
      .then((response: any) => {
        if (response.message) {
          console.log(response.message);
        } else {
          console.log(response.error);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const formatDate = (isoString : string) : string => {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit", // "02"
        minute: "2-digit", // "00"
        second: "2-digit", // "00"
      })
    );
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between p-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
          <svg
            className="w-2.5 h-2.5 me-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
          </svg>
          Since { formatDate( friendRequest.createdAt)}
        </span>
        <button
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <FontAwesomeIcon
            icon={faTrash}
            className="w-5 h-5 hover:text-red-600"
            onClick={handleDelete}
          />
        </button>
      </div>
      <div className="flex flex-col items-center pb-4">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
          alt="Friend's avatar"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {friendRequest.sender.username}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center p-2">
          {friendRequest.comment}
        </span>
        <div className="flex mt-4">
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            className="py-2 px-4 ml-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};
