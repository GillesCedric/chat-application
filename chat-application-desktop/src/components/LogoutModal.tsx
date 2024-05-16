import { faClose, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../modules/manager/User";
import { notify } from "./toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LogOutModal = ({ csrfToken }: { csrfToken: string }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogOut = () => {
    console.log(csrfToken);
    User.signOut({ _csrf: csrfToken })
      .then((response: any) => {
        if (response.error) {
          notify(response.error);
          return;
        } else {
          window.electron.store.set("chat-application-access_token", "");
          window.electron.store.set("chat-application-refresh_token", "");
          notify("Redirecting ...", "success", () => {
            navigate("/signin");
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
        notify(error, "error");
      });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <button
        className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={toggleModal}
        title="Log Out"
      >
        <FontAwesomeIcon icon={faPowerOff} />
      </button>

      {modalVisible && (
        <div
          id="hs-custom-backdrop-modal"
          className="fixed inset-0 bg-black bg-opacity-55 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-xl overflow-hidden shadow-lg max-w-lg w-full m-3"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Confirm Logout
              </h3>
              <button
                type="button"
                className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
                onClick={toggleModal}
              >
                <span className="sr-only">Close</span>
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800 dark:text-neutral-400">
                Are you sure you want to log out?
              </p>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                onClick={toggleModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
