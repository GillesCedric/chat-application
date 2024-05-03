import React from "react";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotifyAsync } from "./NotifyAsync";

export const myAsyncFunction = () => {
  // Replace this with your actual asynchronous operation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        resolve("Operation successful");
      } else {
        reject(new Error("Operation failed"));
      }
    }, 2000);
  });
};

const MyComponent = () => {
  return (
    <div>
      <button
        onClick={()=>NotifyAsync("Operation is pending", "Operation success" , "Operation failed" , myAsyncFunction)}
      >
        Start Async Operation
      </button>
      <ToastContainer />
    </div>
  );
};

export default MyComponent;
