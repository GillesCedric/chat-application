import React, { useState, useRef } from "react";
import { notify } from "../components/toastify";
import { toast } from "react-toastify";
import { NotifyAsync } from "../components/NotifyAsync";
import User from "../modules/manager/User";
import { Link } from "react-router-dom";

const VerifyPage = ({ isTelVerification }: { isTelVerification: boolean }) => {
  const [inputs, setInputs] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = Array(6)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));

  const handleInput = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    if (index < 5 && value) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      !/[0-9]/.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Tab"
    ) {
      event.preventDefault();
    }

    if (event.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      setInputs(
        pasteData.split("").concat(new Array(6 - pasteData.length).fill(""))
      );
      inputRefs[pasteData.length - 1].current?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Verifying:", inputs.join(""));
  };

  const label: string = isTelVerification ? "phone number" : "email";
  return (
    <body className=" flex flex-col  justify-center h-screen bg-grey-lighter">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            Mobile {isTelVerification ? "Phone" : "Email"} Verification
          </h1>
          <p className="text-[17px] text-slate-500">
            Enter the 4-digit verification code that was sent to your{" "}
            {isTelVerification ? "phone number" : "email 2FA email account"}.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {inputs.map((input, index) => (
              <input
                key={index}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-300 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 transition-colors duration-150"
            >
              Verify Code
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{" "}
          <Link
            to="/ForgotPassword"
            className="font-medium text-indigo-500 hover:text-indigo-600"
          >
            Resend
          </Link>
        </div>
      </div>
    </body>
  );
};

export default VerifyPage;
