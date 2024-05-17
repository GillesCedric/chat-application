import React, { useEffect, useState } from "react";
import API from "../modules/api/API";
import ChatHeader from "../components/ChatHeader";
import User, { UserModel } from "../modules/manager/User";
import { notify } from "../components/toastify";
import { Avatar } from "../components/Avatar";
import { NotFound } from "../components/NotFound";
import Modal from "../components/VerifyModal";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    API.getCSRFToken().then((data: any) => {
      setCsrfToken(data.token);
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader csrfToken={csrfToken} />
      <SettingPage csrfToken={csrfToken} />
    </div>
  );
};

const SettingPage = ({ csrfToken }: { csrfToken: string }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fieldToVerify, setFieldToVerify] = useState("");
  const [fieldToVerifyValue, setValueFieldToVerify] = useState("");
  const [initialUser, setInitialUser] = useState<UserModel | null>(null); // Store initial user data

  useEffect(() => {
    me();
  }, [editMode]);

  const me = () => {
    User.me()
      .then((response: any) => {
        if (response.data) {
          setUser(response.data);
          setInitialUser(response.data); // Store initial user data
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        console.error(error);
        notify("Error loading user information", "error");
      });
  };
  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    const dataToSave: { [key: string]: any } = { _csrf: csrfToken };

    if (user && initialUser) {
      for (const key in user) {
        if ((user as any)[key] !== (initialUser as any)[key]) {
          dataToSave[key] = (user as any)[key];
        }
      }
    }

    console.log(dataToSave);
    User.updateProfile(dataToSave)
      .then((response: any) => {
        if (response.message) {
          notify("Reloading ...", "success", () => {
            window.location.reload();
          });

          console.log("User update profile response", response.data);
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });

    setEditMode(false);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setUser(initialUser); // Reset user to initial state if necessary
  };

  const handleInputChange = (field: string, value: string) => {
    setUser({ ...user!, [field]: value });
  };

  const showModal = (label: string, value: string) => {
    setFieldToVerify(label);
    setValueFieldToVerify(value);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const isVerified =
    user?.isEmailVerified === "true" && user?.isTelVerified === "true";

  const handle2FAToggle = () => {
    if (isVerified) {
      const new2FAStatus = user?.is2FAEnabled === "true" ? "false" : "true";
      setUser((prevUser) => {
        if (prevUser) {
          const updatedUser = { ...prevUser, is2FAEnabled: new2FAStatus };
          handleSaveClickWithUser(updatedUser);
          return updatedUser;
        }
        return prevUser;
      });
    }
  };

  const navigate = useNavigate();
  const handleSaveClickWithUser = (updatedUser: UserModel) => {
    const dataToSave: { [key: string]: any } = { _csrf: csrfToken };

    if (updatedUser && initialUser) {
      for (const key in updatedUser) {
        if ((updatedUser as any)[key] !== (initialUser as any)[key]) {
          dataToSave[key] = (updatedUser as any)[key];
        }
      }
    }

    console.log(dataToSave);
    User.updateProfile(dataToSave)
      .then((response: any) => {
        if (response.message) {
          notify("Reloading ...", "success", () => {
            window.location.reload();
          });
          console.log("User update profile response", response.data);
        } else {
          notify(response.error, "error");
        }
      })
      .catch((error: any) => {
        notify(error, "error");
      });

    setEditMode(false);
  };

  if (!user) {
    return (
      <NotFound errorMessage="Seem like we encounter an error loading your information 😞" />
    );
  }

  return (
    <>
      <Modal
        label={fieldToVerify}
        value={fieldToVerifyValue}
        onClose={handleCloseModal}
        isOpen={isOpen}
        csrfToken={csrfToken}
      />
      <div className="bg-grey-lighter grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="mb-4 col-span-full xl:mb-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            User settings
          </h1>
        </div>
        <div className="col-span-full">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                <Avatar
                  fullname={user.firstname + " " + user.lastname}
                  avatar={user.picture}
                />
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                    Profile picture
                  </h3>
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    JPG, GIF or PNG. Max size of 800K
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        className="w-4 h-4 mr-2 -ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                      </svg>
                      Upload picture
                    </button>
                    <button
                      type="button"
                      className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* General informations */}
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              General information
            </h3>
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                      !editMode
                        ? "cursor-not-allowed mb-5 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                        : ""
                    }`}
                    value={user.firstname}
                    readOnly={!editMode}
                    onChange={(e) =>
                      handleInputChange("firstname", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                      !editMode
                        ? "cursor-not-allowed mb-5 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                        : ""
                    }`}
                    value={user.lastname}
                    readOnly={!editMode}
                    onChange={(e) =>
                      handleInputChange("lastname", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        !editMode
                          ? "cursor-not-allowed mb-5 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                          : "cursor-not-allowed mb-5 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                      }`}
                      value={user.email}
                      readOnly
                      required
                    />
                    <span
                      className={`absolute right-2 top-3 text-sm font-medium ${
                        user.isEmailVerified === "true"
                          ? "text-green-600"
                          : "text-red-600 cursor-pointer"
                      }`}
                      onClick={
                        user.isEmailVerified === "true"
                          ? undefined
                          : () => showModal("Email", user.email)
                      }
                    >
                      {user.isEmailVerified === "true"
                        ? "Verified ✅"
                        : "Verify ❗"}
                    </span>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="phone-number"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="tel"
                      name="phone-number"
                      id="phone-number"
                      className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        !editMode
                          ? "cursor-not-allowed mb-5 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                          : ""
                      }`}
                      value={user.tel}
                      readOnly={!editMode}
                      onChange={(e) => handleInputChange("tel", e.target.value)}
                      required
                    />
                    <span
                      onClick={() => {
                        user.isTelVerified === "true"
                          ? () => {
                              return;
                            }
                          : showModal("Phone Number", user.tel);
                      }}
                      className={`absolute right-2 top-3 text-sm font-medium cursor-pointer ${
                        user.isTelVerified === "true"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.isTelVerified === "true"
                        ? "Verified ✅"
                        : "Verify ❗"}
                    </span>
                  </div>
                </div>
                <div className="col-span-6 sm:col-full">
                  {editMode ? (
                    <>
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                        onClick={handleSaveClick}
                      >
                        Save all
                      </button>
                      <button
                        className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 ml-2"
                        type="button"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                      onClick={handleUpdateClick}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          {/* Security Settings */}
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flow-root">
              <h3 className="text-xl font-semibold dark:text-white">
                Security Settings
              </h3>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Manage your security settings. Two-factor authentication can
                only be enabled if both email and phone number are verified.
              </p>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex items-center justify-between py-4">
                  <div className="flex flex-col flex-grow">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      Two-factor authentication
                    </div>
                    <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Offers more security while connecting.
                    </div>
                  </div>
                  <label
                    htmlFor="2fa-verification"
                    className={`relative flex items-center ${
                      !isVerified
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="2fa-verification"
                      className="sr-only"
                      checked={user.is2FAEnabled === "true"}
                      readOnly
                      onClick={handle2FAToggle}
                      disabled={!isVerified}
                    />
                    <span
                      className={`h-6 w-11 rounded-full ${
                        user.is2FAEnabled === "true"
                          ? "bg-blue-600 border-blue-600"
                          : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute left-0 h-5 w-5 m-0.5 rounded-full bg-white transition-transform ${
                          user.is2FAEnabled === "true"
                            ? "transform translate-x-5"
                            : ""
                        }`}
                      ></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
