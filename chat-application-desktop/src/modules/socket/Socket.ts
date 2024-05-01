// Socket.ts
import { io, Socket as SocketClient } from "socket.io-client";
import CONFIG from "../../config/config.json";

class Socket {
  public static socket: SocketClient;

  public static connect() {
    this.socket = io(`${CONFIG.socket_url}/`, {
      // Additional options if necessary
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
