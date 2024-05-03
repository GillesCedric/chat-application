// Socket.ts
import { io, Socket as SocketClient } from "socket.io-client";
import CONFIG from "../../config/config.json";
import { Crypto } from "../crypto/Crypto";

class Socket {
  public static socket: SocketClient;

  private static async getAccessToken() {
    return await window.electron.store.get(
      "chat-application-access_token"
    );
  }
  public static async connect() {
    const extraHeaders = {
      Authorization: "Basic " + Crypto.encode(`${CONFIG.basic_username}:${CONFIG.basic_password}`),
      Token: "Bearer " + await this.getAccessToken(),
    }
    this.socket = io(`${CONFIG.socket_url}/`, {
      extraHeaders: extraHeaders,
    });
    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });
  }

  public static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default Socket;
