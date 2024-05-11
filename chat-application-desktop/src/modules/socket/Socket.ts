/**
*
* 
Ce code définit une classe Socket qui gère la connexion au serveur WebSocket à l'aide de la bibliothèque socket.io-client. La méthode statique connect est utilisée pour établir une connexion avec le serveur en fournissant des en-têtes supplémentaires, notamment l'autorisation de base et le jeton d'accès récupéré à partir du stockage sécurisé. La méthode statique disconnect est utilisée pour fermer la connexion WebSocket existante. Cette classe encapsule la logique de connexion et de déconnexion au serveur WebSocket, offrant ainsi une abstraction pratique pour interagir avec le serveur.
 * @module modules/socket/Socket
 */

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
