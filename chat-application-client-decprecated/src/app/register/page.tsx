// A rajouter : quand on back , reset les fields ou pas , à voir , reste les messags d'erreur
"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import API from "../../modules/api/API";
export default function Home() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const telRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmpasswordRef = useRef<HTMLInputElement | null>(null);

  const emailSectionRef = useRef<HTMLDivElement | null>(null);
  const nameSectionRef = useRef<HTMLDivElement | null>(null);
  const telSectionRef = useRef<HTMLDivElement | null>(null);
  const usernameSectionRef = useRef<HTMLDivElement | null>(null);
  const passwordSectionRef = useRef<HTMLDivElement | null>(null);

  const firstnamecheckRef = useRef<HTMLDivElement | null>(null);
  const lastnamecheckRef = useRef<HTMLDivElement | null>(null);
  const emailcheckRef = useRef<HTMLDivElement | null>(null);
  const usernameCheckRef = useRef<HTMLDivElement | null>(null);
  const passwordCheckRef = useRef<HTMLDivElement | null>(null);
  const telCheckRef = useRef<HTMLDivElement | null>(null);

  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const signupRef = useRef<HTMLButtonElement | null>(null);

  const registrationFailSectionRef = useRef<HTMLInputElement | null>(null);
  const registrationSuccessSectionRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [etape, setEtape] = useState(1);

  useEffect(() => {
    if (1 === etape) {
      backButtonVisible(false);
      nextButtonVisible(true);
      signupButtonVisible(false);
    } else if (5 === etape) {
      backButtonVisible(true);
      nextButtonVisible(false);
      signupButtonVisible(true);
    } else {
      backButtonVisible(true);
      nextButtonVisible(true);
      signupButtonVisible(false);
    }
  }, [etape]);

  const backButtonVisible = (visibility: boolean) => {
    if (backButtonRef.current) {
      if (visibility) {
        backButtonRef.current.className =
          "w-full mr-14 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
      } else {
        backButtonRef.current.className = "hidden";
      }
    }
  };

  const preventLetter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (telRef.current) {
      const inputValue = event.target.value;
      const sanitizedValue = inputValue.replace(/[^0-9-]/g, "");
      telRef.current.value = sanitizedValue;
    }
  };

  const nextButtonVisible = (visibility: boolean) => {
    if (nextButtonRef.current) {
      if (visibility) {
        nextButtonRef.current.className =
          "w-full mr-14 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
      } else {
        nextButtonRef.current.className = "hidden";
      }
    }
  };

  const checkEmail = () => {
    setErrorMessage("");
    if (emailRef.current && emailcheckRef.current) {
      const email = emailRef.current.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email !== "" && emailRegex.test(email)) {
        // Check if email is unique
        // code ...
        emailcheckRef.current.className = "hidden";
        return true;
      } else {
        if (email.trim() === "") {
          emailcheckRef.current.className = "block";
          setErrorMessage("This field can not be empty !");
          return false;
        } else if (!emailRegex.test(email)) {
          emailcheckRef.current.className = "block";
          setErrorMessage("Email should match this format : name@domain.org");
          return false;
        }
      }
    }
    return false;
  };

  const checkTel = () => {
    setErrorMessage("");
    if (telRef.current && telCheckRef.current) {
      const tel = telRef.current.value;
      if (tel.trim() !== "") {
        telCheckRef.current.className = "hidden";
        return true;
      } else {
        setErrorMessage("This field can not be empty !");
        telCheckRef.current.className = "block";
        return false;
      }
    }
    return false;
  };

  const signupButtonVisible = (visibility: boolean) => {
    if (signupRef.current) {
      if (!visibility) {
        signupRef.current.className = "hidden";
      } else {
        signupRef.current.className =
          " text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
      }
    }
  };
  const checkPassword = () => {
    setErrorMessage("");
    if (
      passwordCheckRef.current &&
      passwordRef.current &&
      confirmpasswordRef.current
    ) {
      const password = passwordRef.current.value;
      const confirmPassword = confirmpasswordRef.current.value;
      if (
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        password === confirmPassword
      ) {
        passwordCheckRef.current.className = "hidden";
        return true;
      } else {
        if (password.trim() === "") {
          setErrorMessage("Please fill all the fields !");
          passwordCheckRef.current.className =
            "text-sm text-red-600 dark:text-red-500";
          return false;
        }
        if (confirmPassword.trim() === "") {
          setErrorMessage("Please fill all the fields !");
          passwordCheckRef.current.className =
            "text-sm text-red-600 dark:text-red-500";
          return false;
        }
        if (password !== confirmPassword) {
          setErrorMessage("Fields does not match !");
          passwordCheckRef.current.className =
            "text-sm text-red-600 dark:text-red-500";
          return false;
        }
      }
    }
  };

  const checkUsername = () => {
    setErrorMessage("");
    if (usernameRef.current && usernameCheckRef.current) {
      const username = usernameRef.current.value;
      if (username !== "") {
        usernameCheckRef.current.className = "hidden";
        return true;
      } else {
        setErrorMessage("This field can not be empty !");
        usernameCheckRef.current.className =
          "text-sm text-red-600 dark:text-red-500";
        return false;
      }
    }
    return false;
  };

  const moveOn = () => {
    if (
      emailSectionRef.current &&
      nameSectionRef.current &&
      usernameSectionRef.current &&
      telSectionRef.current &&
      passwordSectionRef.current &&
      nextButtonRef.current
    ) {
      nextButtonRef.current.blur();
      switch (etape) {
        case 1:
          console.log("Etape :" + etape);
          if (checkNames()) {
            emailSectionRef.current.className = "hidden";
            telSectionRef.current.className = "hidden";
            passwordSectionRef.current.className = "hidden";
            nameSectionRef.current.className = "hidden";
            usernameSectionRef.current.className = "flex flex-col mb-5";
            setEtape(2);
          }
          break;
        case 2:
          if (checkUsername()) {
            console.log("Etape :" + etape);
            telSectionRef.current.className = "hidden";
            passwordSectionRef.current.className = "hidden";
            nameSectionRef.current.className = "hidden";
            usernameSectionRef.current.className = "hidden";
            emailSectionRef.current.className = "flex flex-col mb-5";
            setEtape(3);
          }
          break;
        case 3:
          if (checkEmail()) {
            console.log("Etape :" + etape);
            passwordSectionRef.current.className = "hidden";
            nameSectionRef.current.className = "hidden";
            usernameSectionRef.current.className = "hidden";
            emailSectionRef.current.className = "hidden";
            telSectionRef.current.className = "flex flex-col mb-5";
            setEtape(4);
          }
          break;
        case 4:
          if (checkTel()) {
            console.log("Etape :" + etape);
            nameSectionRef.current.className = "hidden";
            usernameSectionRef.current.className = "hidden";
            telSectionRef.current.className = "hidden";
            emailSectionRef.current.className = "hidden";
            passwordSectionRef.current.className = "flex flex-col mb-5";
            setEtape(5);
          }
          break;
        default:
          break;
      }
    }
  };

  const moveBack = () => {
    if (
      emailSectionRef.current &&
      nameSectionRef.current &&
      usernameSectionRef.current &&
      telSectionRef.current &&
      passwordSectionRef.current &&
      nameSectionRef.current &&
      backButtonRef.current
    ) {
      backButtonRef.current.blur();
      switch (etape) {
        case 2:
          nameSectionRef.current.className = "flex flex-col mb-5";
          emailSectionRef.current.className = "hidden";
          telSectionRef.current.className = "hidden";
          passwordSectionRef.current.className = "hidden";
          usernameSectionRef.current.className = "hidden";
          setEtape(1);
          break;
        case 3:
          telSectionRef.current.className = "hidden";
          usernameSectionRef.current.className = "flex flex-col mb-5";
          emailSectionRef.current.className = "hidden";
          passwordSectionRef.current.className = "hidden";
          nameSectionRef.current.className = "hidden";
          setEtape(2);
          break;
        case 4:
          telSectionRef.current.className = "hidden";
          emailSectionRef.current.className = "flex flex-col mb-5";
          usernameSectionRef.current.className = "hidden";
          passwordSectionRef.current.className = "hidden";
          nameSectionRef.current.className = "hidden";
          setEtape(3);
          break;

        case 5:
          telSectionRef.current.className = "flex flex-col mb-5";
          nameSectionRef.current.className = "hidden";
          emailSectionRef.current.className = "hidden";
          usernameSectionRef.current.className = "hidden";
          passwordSectionRef.current.className = "hidden";
          setEtape(4);
          break;
        default:
          break;
      }
    }
  };

  const signUp = () => {
    if (checkPassword()) {
      API.register({
        firstname: firstnameRef.current?.value,
        lastname: lastnameRef.current?.value,
        username: usernameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        tel: telRef.current?.value
      })
      .then((data: any) => {
        console.log(data)
      })
      return true;
    }
    return false;
  };

  function checkNames() {
    if (
      firstnameRef.current &&
      lastnameRef.current &&
      nameSectionRef.current &&
      emailSectionRef.current &&
      lastnamecheckRef.current &&
      firstnamecheckRef.current
    ) {
      if (
        firstnameRef.current.value !== "" &&
        lastnameRef.current.value !== ""
      ) {
        firstnamecheckRef.current.className = "hidden";
        lastnamecheckRef.current.className = "hidden ";
        return true;
      } else {
        if (firstnameRef.current.value === "") {
          firstnamecheckRef.current.className = "text-sm  text-red-500 ";
          setErrorMessage("This field can not be empty !");
        } else {
          firstnamecheckRef.current.className = "hidden";
        }
        if (lastnameRef.current.value === "") {
          lastnamecheckRef.current.className = "text-sm  text-red-500 ";
          setErrorMessage("This field can not be empty !");
        } else {
          lastnamecheckRef.current.className = "hidden ";
        }
        return false;
      }
    }
    return false;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div ref={nameSectionRef}>
                <div>
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your firstname
                  </label>
                  <input
                    type="firstname"
                    name="firstname"
                    id="firstname"
                    className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Richard"
                    ref={firstnameRef}
                    onKeyUp={checkNames}
                  />
                </div>
                <div className="hidden" ref={firstnamecheckRef}>
                  {errorMessage}
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your lastname
                  </label>
                  <input
                    type="lastname"
                    name="lastname"
                    id="lastname"
                    className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Dupont"
                    ref={lastnameRef}
                    onKeyUp={checkNames}
                  />
                  <div className="hidden" ref={lastnamecheckRef}>
                    {errorMessage}
                  </div>
                </div>
              </div>
              <div className="hidden" ref={usernameSectionRef}>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="blue"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <input
                    ref={usernameRef}
                    type="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="_trafalgar_D"
                    onKeyUp={checkUsername}
                  />
                  <div ref={usernameCheckRef} className="hidden">
                    <p className="text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">Oops!</span> {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden" ref={emailSectionRef}>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="blue"
                      viewBox="0 0 20 16"
                    >
                      <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                      <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                    </svg>
                  </div>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    onKeyUp={checkEmail}
                  />
                  <div ref={emailcheckRef} className="hidden">
                    <p className="text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">Oops!</span> {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden" ref={telSectionRef}>
                <label
                  htmlFor="tel"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="blue"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <input
                    ref={telRef}
                    type="tel"
                    pattern="[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}"
                    id="telephone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="06-89-09-32-02"
                    onChange={() => {
                      checkTel;
                      preventLetter;
                    }}
                  />
                  <div ref={telCheckRef}>
                    <p className="text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">Oops!</span> {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
              <div ref={passwordSectionRef} className="hidden">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  ref={passwordRef}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onKeyUp={checkPassword}
                />
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  placeholder="••••••••"
                  ref={confirmpasswordRef}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onKeyUp={checkPassword}
                />
                <p
                  ref={passwordCheckRef}
                  className="hidden text-sm text-red-600 dark:text-red-500"
                >
                  <span className="font-medium">Oops!</span> {errorMessage}
                </p>
              </div>
              <div className="flex">
                <button
                  ref={backButtonRef}
                  onClick={(event) => {
                    event.preventDefault();
                    moveBack();
                  }}
                  className="hidden text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Back
                </button>
                <button
                  ref={nextButtonRef}
                  onClick={(event) => {
                    event.preventDefault();
                    moveOn();
                  }}
                  className="hidden text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Next
                </button>
                <button
                  ref={signupRef}
                  onClick={(event) => {
                    event.preventDefault();
                    signUp();
                  }}
                  className="hidden text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Sign up
                </button>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account ?
                <Link
                  href="/signin"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500 ml-1"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
