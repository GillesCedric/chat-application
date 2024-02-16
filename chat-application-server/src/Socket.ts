import { Socket as WebSocket, } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { SocketKeywords } from "./utils/Keywords";



export default class Socket {

	public static readonly serve = (socket: WebSocket, next: (err?: ExtendedError) => void): void => {

		socket.on(SocketKeywords.join, (data) => {
			socket.join(data.chat_id)
			console.log(`client ${data.chat_id} joined`)
		})

		socket.on('connect', data => {
			console.log('test')
		})

	};
}
