"use client";
import React, { useEffect, useRef, useState } from "react";
import API from "../modules/api/API";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../components/toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../context/AuthContext";
import { error } from "console";
export default function SignIn() {
  const { authUser, setAuthUser } = useAuthContext();
  const [csrfToken, setCsrfToken] = useState("");

  const csrfTokenRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    API.getCSRFToken().then((data : any) => {
      setCsrfToken(data.token);
    });
  }, []);

  const signIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    API.login(
      {
        _csrf: csrfTokenRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      },
      { "csrf-token": csrfToken }
    ).then((data: any) => {
      if (data.reason && data.reason == "2FAEnabled") {
        // TODO redirect to code verification page
        console.log("Redirection");
      } else if (data.message) {
        //window.electron.store.set('chat-application-access_token', data.access_token)
        //window.electron.store.set('chat-application-refresh_token', data.refresh_token)
        setAuthUser(data.access_token);
      } else if (data.error) {
        if (data.error === "already authenticated") {
          setAuthUser(true);
        } else {
          notify(data.error, "error");
        }
      } else if (data.errors) {
        const errors: any[] = data.errors;
        errors.forEach((error) => {
          notify(error.msg + " for " + error.path, "error");
        });
      }
    });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <ToastContainer />

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <input
                  ref={csrfTokenRef}
                  type="hidden"
                  name="_csrf"
                  value={csrfToken}
                />
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Link
                      to="/VerifyPage"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </Link>
                  </div>
                </div>
                <Link
                  to="/forgotPassword"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => signIn(event)}
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500 ml-1"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
