/**
 * The FriendRequestComponent represents a friend request in the user interface.
 * It displays the details of the friend request, including the sender's name, comment, and creation date.
 * Users can accept, reject, or delete the request.
 *
 * @module components/FriendRequestComponent
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import User from "../modules/manager/User";
import { FriendsRequestStatus } from "../utils/keywords";
import { notify } from "./toastify";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Avatar } from "./Avatar";

/**
 * Composant FriendRequestComponent.
 * 
 * Représente une demande d'ami dans l'interface utilisateur. Affiche les détails de la demande d'ami,
 * y compris le nom de l'expéditeur, le commentaire, et la date de création.
 * Les utilisateurs peuvent accepter ou rejeter la demande, ainsi que supprimer la demande.
 * 
 * @param friendRequest Un objet représentant la demande d'ami, incluant les informations sur l'expéditeur, le commentaire, et la date de création.
 * @returns {JSX.Element} Le composant FriendRequestComponent.
 */
export const FriendRequestComponent = ({
  friendRequest,
  csrfToken,
}: {
  /**
   * Un objet représentant la demande d'ami. 
   * Contient les informations telles que l'identifiant de la demande, le nom de l'expéditeur, le commentaire, et la date de création.
   */
  friendRequest: any;
  csrfToken: string;
}) => {
  const navigate = useNavigate();
  const friendRequestId: string = friendRequest._id;

  const handleAccept = () => {
    const data = {
      status: FriendsRequestStatus.accepted,
      _csrf: csrfToken,
    };

    User.updateFriendRequest(friendRequestId, data)
      .then((response: any) => {
        if (response.message) {
          notify("Friend request successfully accepted", "success", () => {
            navigate("/");
          });
        } else {
          notify(response.message, "error");
        }
      })
      .catch((error: any) => {
        console.log(error);
        notify("An error occurred!", "error");
      });
  };

  const handleDelete = () => {
    User.updateFriendRequest(friendRequestId, {
      status: FriendsRequestStatus.deleted,
      _csrf: csrfToken,
    })
      .then((response: any) => {
        if (response.message) {
          notify("Friend request deleted", "success");
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleReject = () => {
    User.updateFriendRequest(friendRequestId, {
      status: FriendsRequestStatus.rejected,
      _csrf: csrfToken,
    })
      .then((response: any) => {
        if (response.message) {
          notify("Friend request rejected", "success");
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const formatDate = (isoString: string): string => {
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
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  return (
    <>
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
            Since {formatDate(friendRequest.createdAt)}
          </span>
{/*           <button
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
            onClick={handleDelete}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="w-5 h-5 hover:text-red-600"
            />
          </button> */}
        </div>
        <div className="flex flex-col items-center pb-4">
          <Avatar
            fullname={friendRequest.sender.fullname}
            avatar={friendRequest.sender.picture}
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {friendRequest.sender.fullname}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center p-2">
            {friendRequest.comment}
          </span>
          <div className="flex mt-4 justify-between">
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
    </>
  );
};
