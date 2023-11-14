'use client'
import { useRef, useState , useEffect} from "react";
import Link from 'next/link';

const Signup = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const emailSectionRef = useRef<HTMLDivElement>(null);
  const nameSectionRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);
  const firstnamecheckRef = useRef<HTMLDivElement>(null);
  const lastnamecheckRef = useRef<HTMLDivElement>(null);
  const emailcheckRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  const registrationFailSectionRef = useRef<HTMLDivElement>(null);
  const registrationSuccessSectionRef = useRef<HTMLDivElement>(null);




  function checkNames() {
    if (firstnameRef?.current?.value !== "" && lastnameRef?.current?.value !== "") {
      nameSectionRef?.current?.classList.add("hidden");
      emailSectionRef?.current?.classList.add("flex", "flex-col", "mb-5");
    } else {
      if (firstnameRef?.current?.value === "") {
        firstnamecheckRef?.current?.classList.add("text-sm", "text-red-500");
      } else {
        firstnamecheckRef?.current?.classList.add("hidden");
      }
      if (lastnameRef?.current?.value === "") {
        lastnamecheckRef?.current?.classList.add("text-sm", "text-red-500");
      } else {
        lastnamecheckRef?.current?.classList.add("hidden");
      }
    }

    // Update state if registration is successful
    setRegistrationSuccess(true);

    // Update state if there is an error during registration
    setRegistrationError(true);
  }

  function checkEmail() {
    // Your existing code...
  }

  function registerNewUser() {
    // Your existing code...
  }

  useEffect(() => {
    if (registrationSuccess) {
      // Do something on successful registration
      // For example, show a success message or redirect to another page
    }

    if (registrationError) {
      // Handle the error state, display an error message or take appropriate action
    }
  }, [registrationSuccess, registrationError]);

  return (
    <div className="bg-gray-100">
      <div id="alert-3" ref={registrationSuccessSectionRef} className="w-full hidden flex p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
        {/* ... Success message content ... */}
      </div>

      <div ref={registrationFailSectionRef} id="alert-2" className="hidden flex p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {/* ... Error message content ... */}
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div
          className="
                    flex flex-col
                    bg-white
                    shadow-md
                    px-4
                    sm:px-6
                    md:px-8
                    lg:px-10
                    py-8
                    rounded-3xl
                    "
        >
          <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
            Who's there ? New user 👀
          </div>
          <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
            Register now
          </div>

          <div className="mt-10">
            <div ref={nameSectionRef} className="">
              {/* ... Name section content ... */}
            </div>

            <div ref={emailSectionRef} className="flex flex-col mb-5 hidden">
              {/* ... Email section content ... */}
            </div>

            <div ref={signupRef} className="hidden">
              {/* ... Signup section content ... */}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-6">

            <Link href="/" className="
                inline-flex
                items-center
                text-gray-700
                font-medium
                text-xs text-center
            ">
              <span className="ml-2">Already have an account?</span>
              <span className="text-xs ml-2 text-blue-500 font-semibold">Sign in</span>
            </Link>

        </div>
      </div>
    </div>
  );
};

export default Signup;
