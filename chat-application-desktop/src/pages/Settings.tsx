import ChatHeader from "../components/ChatHeader";

export const Settings = () => {
  return (
    <div className="h-screen">
      <ChatHeader />
      <SettingPage />
    </div>
  );
};
import React, { useState } from "react";

const SettingPage = () => {
  const [editMode, setEditMode] = useState(false);

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    // Add your save logic here
  };

  const handleCancelClick = () => {
    setEditMode(false);
    // Add logic to revert changes if necessary
  };

  return (
    <>
      <div className="bg-white w-full h-full flex px-3 md:px-16 lg:px-28 text-[#3e3e43]">
        <main className="w-full h-full py-1 ">
          <div className="p-2 md:p-4">
            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                Public Profile
              </h2>

              <div className="grid max-w-2xl mx-auto mt-8">
                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=htmlFormat&fit=crop&w=500&q=60"
                    alt="Bordered avatar"
                  />
                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"
                    >
                      Change picture
                    </button>
                    <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200"
                    >
                      Delete picture
                    </button>
                  </div>
                </div>

                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: "first_name",
                        label: "Your first name",
                        value: "Jane",
                      },
                      {
                        id: "last_name",
                        label: "Your last name",
                        value: "Ferguson",
                      },
                      {
                        id: "email",
                        type: "email",
                        label: "Your email",
                        value: "your.email@mail.com",
                      },
                      {
                        id: "username",
                        label: "Username",
                        value: "your username",
                      },
                      {
                        id: "tel",
                        type: "tel",
                        label: "Telephone number",
                        value: "07 82 62 50 71",
                      },
                    ].map((field) => (
                      <div key={field.id} className="mb-2 sm:mb-6">
                        <label
                          htmlFor={field.id}
                          className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type || "text"}
                          id={field.id}
                          className={`bg-${
                            editMode ? "white" : "gray-100"
                          } border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 ${
                            !editMode
                              ? "cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                              : ""
                          }`}
                          placeholder={field.value}
                          disabled={!editMode}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    {editMode && (
                      <>
                        <button
                          type="button"
                          className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                          onClick={handleSaveClick}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {!editMode && (
                      <button
                        type="button"
                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                        onClick={handleUpdateClick}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingPage;

