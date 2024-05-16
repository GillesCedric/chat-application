import React, { useState, useRef, useEffect } from "react";
import User from "../modules/manager/User";
import API from "../modules/api/API";
import { notify } from "./toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const MobileVerification: React.FC = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const location = useLocation();
  const is2FA : boolean = location.state?.is2FA || false;
  const userId : string = location.state?.userId || "";
  useEffect(() => {
    API.getCSRFToken().then((data: any) => {
      setCsrfToken(data.token);
    });
    console.log(is2FA);
  }, []);

  const [inputs, setInputs] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = Array(6)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));

  const handleInput = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    // Move focus forward
    if (index < 5 && value) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const navigate = useNavigate();
  let notificationShown = false;

  const submitCode = () => {
    if (notificationShown) return; // Prevent multiple notifications

    console.log("Verifying:", inputs.join(""));
    if (is2FA) {
      User.checkCode2FA({ _csrf: csrfToken, userId : userId ,  code: inputs.join("") })
        .then((response: any) => {
          if (response.message) {
            notificationShown = true;
            notify("Code correct.\n Redirecting ...", "success", () => {
              navigate("/settings");
            });
          } else {
            notificationShown = true;
            notify(response.error, "error");
          }
        })
        .catch((error: any) => {
          notificationShown = true;
          notify(error, "error");
        });
    } else {
      User.checkCodeTel({ _csrf: csrfToken, code: inputs.join("") })
        .then((response: any) => {
          if (response.message) {
            notificationShown = true;
            notify("Code correct.\n Redirecting ...", "success", () => {
              navigate("/settings");
            });
          } else {
            notificationShown = true;
            notify(response.error, "error");
          }
        })
        .catch((error: any) => {
          notificationShown = true;
          notify(error, "error");
        });
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      !/[0-9]/.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Tab" &&
      event.key !== "Enter"
    ) {
      event.preventDefault();
    }

    if (event.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    if (event.key === "Enter" && !inputs.some((input) => input === "")) {
      submitCode();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newInputs = pasteData
        .split("")
        .concat(new Array(6 - pasteData.length).fill(""));
      setInputs(newInputs);
      inputRefs[pasteData.length - 1].current?.focus();
    }
  };

  const sendVerificatitonCode = () => {
    User.verifyTel({ _csrf: csrfToken }).then((response: any) => {
      if (response.message) {
        notify(response.message, "success", () => {
          navigate("/verifyPage");
        });
      } else {
        notify(response.error, "error");
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitCode();
  };

  const isButtonDisabled = inputs.some((input) => input === "");

  return (
    <>
      <ToastContainer />
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow ">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 6-digit verification code that was sent to your phone
            number .
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {inputs.map((input, index) => (
              <input
                key={index}
                type="text"
                className="w-12 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                pattern="\d*"
                maxLength={1}
                value={input}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={inputRefs[index]}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className={`w-full inline-flex justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 focus:outline-none focus:ring focus:ring-indigo-300 ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
              disabled={isButtonDisabled}
              onClick={() => handleSubmit}
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className=" w-full flex j gap-9 justify-between">
          <div className="text-sm text-slate-500 mt-4">
            Go back to{" "}
            <Link
              to="/"
              className="font-medium text-indigo-500 hover:text-indigo-600"
            >
              home page
            </Link>
          </div>
          <div className="text-sm text-slate-500 mt-4">
            Didn't receive the code ?{" "}
            <span
              onClick={sendVerificatitonCode}
              className="font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer"
            >
              Resend code
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileVerification;
