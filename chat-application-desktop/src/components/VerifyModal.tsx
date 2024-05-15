import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import User from "../modules/manager/User";
import { notify } from "./toastify";
import { ToastContainer } from "react-toastify";

const Modal = ({
  label,
  value,
  onClose,
  isOpen,
  csrfToken,
}: {
  label: string;
  value: string;
  onClose: any;
  isOpen: boolean;
  csrfToken: string;
}) => {
  const verificationMessage =
    label === "Email"
      ? `A verification link will be sent to the email address: ${value}.`
      : `A 6-digit verification code will be sent to the phone number: ${value}.`;

  const actionText = label === "Email" ? "Send Link" : "Send Code";

  const navigate = useNavigate();
  const sendVerificatitonCode = () => {
    User.verifyTel({ _csrf: csrfToken }).then((response: any) => {
      if (response.message) {
        notify(response.message, "success", () => {
          navigate("/verifyPage");
        });
      }
      else {
        notify(response.error, "error");
      }
    });
  };
  return (
    <>
      <ToastContainer />
      <div
        id="default-modal"
        tabIndex={-1}
        aria-hidden={!isOpen}
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed inset-0 z-50 overflow-y-auto overflow-x-hidden justify-center items-center bg-black bg-opacity-50`}
        onClick={onClose}
      >
        <div
          className="relative p-4 w-full max-w-2xl max-h-full"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Verify {label}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faXmark} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {verificationMessage}
              </p>
            </div>
            {/* Modal footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => sendVerificatitonCode()}
              >
                {actionText}
              </button>
              <button
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
