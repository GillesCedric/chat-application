import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";
import { AuthNavigationProvider } from "./context/AuthNavigationProider";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <AuthNavigationProvider>
            <App />
          </AuthNavigationProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </HashRouter>
  </React.StrictMode>
);
