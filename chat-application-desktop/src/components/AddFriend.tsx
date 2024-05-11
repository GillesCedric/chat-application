/**
 * 
 * Ce code constitue un composant React pour l'ajout d'amis.Lorsque l'utilisateur clique sur le bouton "Send invitation", un modal s'ouvre pour saisir le nom d'utilisateur et un commentaire optionnel pour l'invitation.Le composant utilise la bibliothèque FontAwesome pour les icônes et React Toastify pour afficher les notifications.L'état du modal est géré via useState pour contrôler son ouverture et sa fermeture. Lorsque l'utilisateur soumet le formulaire, une requête est envoyée au serveur via l'API pour envoyer une demande d'ami.Les erreurs sont gérées et affichées à l'utilisateur via les notifications.
 * 
 * @module components/AddFriend
 */

import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import User from "../modules/manager/User";
import { notify } from "./toastify";
import { ToastContainer } from "react-toastify";
import { DEFAULT_COMMENT } from "../utils/keywords";
import API from "../modules/api/API";


export const AddFriend = () => {
  // Close modal if clicked outside of it
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={toggleModal} // Toggle modal on click
          className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 transition-all duration-500 rounded-full text-white text-xs font-semibold leading-4"
        >
          Send invitation
        </button>
      </div>
      {isModalOpen && <FriendRequestModal closeModal={toggleModal} />}
    </>
  );
};

const FriendRequestModal = ({ closeModal }: { closeModal: any }) => {
  const modalRef = useRef();
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const csrfTokenRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    API.getCSRFToken().then((data: any) => {
      setCsrfToken(data.token);
    });
  }, []);
  const handleClose = (e: React.FormEvent) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  const handleSendFriendRequest = (e: React.FormEvent): void => {
    e.preventDefault();
    if (username.trim() === "") {
      notify("Username cannot be empty", "error");
      return;
    }
    if (comment.trim() === "") {
      setComment(DEFAULT_COMMENT);
    }
    User.sendFriendRequest({
      username: username,
      comment: comment.trim() === "" ? DEFAULT_COMMENT : comment.trim(),
      _csrf: csrfTokenRef.current?.value,
    })
      .then((response: any) => {
        if (response.message) {
          notify(response.message, "success", closeModal);
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });
  };
  return (
    <>
      <div
        ref={modalRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center "
      >
        <ToastContainer className="mt-10" />
        <div
          className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          {/* Modal Close Button */}
          <button
            onClick={closeModal} // Close the modal
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <form className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <input
                  ref={csrfTokenRef}
                  type="hidden"
                  name="_csrf"
                  value={csrfToken}
                />
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="trafalgar_d_water"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Invitation comment
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={"Default message : " + DEFAULT_COMMENT}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSendFriendRequest}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="me-1 -ms-1 w-5 h-5"
              />
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
