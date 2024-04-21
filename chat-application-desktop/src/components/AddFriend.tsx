import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

export const AddFriend = ({ closeModal } : {closeModal : any}) => {
  // Close modal if clicked outside of it
  const modalRef = useRef();

  const handleClose = (e: React.FormEvent) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
    >
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
                placeholder="Write a comment about your invitation here ..."
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >

            <FontAwesomeIcon
              icon={faPaperPlane}
              className="me-1 -ms-1 w-5 h-5"
            />
            Send invitation
          </button>
        </form>
      </div>
    </div>
  );
};
