// Socket.ts
import { io, Socket as SocketClient } from "socket.io-client";
import CONFIG from "../../config/config.json";
import { toast } from "react-toastify";
import API from "../api/API";
import { SocketKeywords } from "../../utils/keywords";

class Socket {
  public static socket: SocketClient;

  public static connect() {
    this.socket = io(`${CONFIG.socket_url}/`, {
      // Additional options if necessary
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.initializeListeners();
    });
  }

  private static initializeListeners() {
    this.socket.on(
      SocketKeywords.newNotification,
      (data: { username: string; comment: string }) => {
        console.log(
          data.username + " sent you a fruend request : " + data.comment
        );
      }
    );

    this.socket.on(SocketKeywords.disconnect, (data) => {
      //
    });

    this.socket.on("friend_request_response", (data) => {
      // Response could be success or error type
      toast(data.message, { type: data.type });
    });
  }

  public static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default Socket;
