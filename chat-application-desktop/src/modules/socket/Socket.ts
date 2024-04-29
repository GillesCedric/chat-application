import { io, Socket as SocketClient } from "socket.io-client"
import CONFIG from "../../config/config.json"

export default class Socket {

	public static socket: SocketClient

	public static readonly connect = () => {
		this.socket = io(`${CONFIG.socket_url}/`, {

		})

	}

}
