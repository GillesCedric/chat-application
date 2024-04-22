import { Socket as WebSocket, } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { SocketKeywords, Tokens } from "../../utils/Keywords";
import { Server as SocketServer } from "socket.io"



export default class Socket {

	public static socket: SocketServer

	public static readonly serve = (socketServer: SocketServer): void => {

		this.socket = socketServer

		this.socket.on('connection', socket =>  {
			console.log('connection')
			socket.on('message', (data) => {
				console.log('received: %s', data)
				
			});

		});


	}
}
