import { Socket as WebSocket, } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { SocketKeywords, Tokens } from "../../utils/Keywords";
import { Server as SocketServer } from "socket.io"
import JWTUtils from "../../modules/jwt/JWT";
import { UserSocketModel } from "../../models/UserSocket";



export default class Socket {

	private static socket: SocketServer

	private static readonly userSockets = new Map<string, Set<string>>()

	public static readonly sendEventToUser = async (userId: string, data: any, event: SocketKeywords) => {

		try {
			const userSockets = await UserSocketModel.find({ user: userId })
			userSockets.forEach((userSocket) => {
				console.log("Emit socket event")
				this.socket.to(userSocket.socket).emit(event, data)
			});
		} catch (err) {
			console.log('Error sending message to user:', err);
		}

	}


	public static readonly serve = (socketServer: SocketServer): void => {

		this.socket = socketServer

		this.socket.on(SocketKeywords.connection, async (socket) => {
			console.log("connection client")
			try {

				const userId = await JWTUtils.getUserFromToken(socket.handshake.headers['token'] as string, socket.handshake.headers["user-agent"] as string, Tokens.accessToken)

				const userSocket = await UserSocketModel.findOne({
					user: userId,
				}).sort({ createdAt: -1 })

				if (userSocket) {
					userSocket.socket = socket.id
					await userSocket.save()
				} else {
					// Enregistrer une nouvelle association socketId
					//await new UserSocketModel({ user: socket.data.userId, socket: socket.id }).save()
					await new UserSocketModel({ user: userId, socket: socket.id }).save()
				}

			} catch (err) {
				console.error('Error saving user socket:', err)
			}

			// Pour gérer la déconnexion
			socket.on(SocketKeywords.disconnect, async () => {

				try {
					// Supprimer l'association lors de la déconnexion
					await UserSocketModel.deleteOne({ socket: socket.id })

				} catch (err) {
					console.error('Error deleting user socket:', err)
				}

			})

			socket.on('message', (data) => {
				console.log('received: %s', data)

			});

		});


	}
}
