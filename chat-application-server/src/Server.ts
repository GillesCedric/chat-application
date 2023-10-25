import { Socket } from 'socket.io'
import App from './App'
import { SocketKeywords } from './utils/Keywords'

/**
 * @class Server
 * @author Gilles Cédric
 * @description this class is used to represent the Server instance, the main class of the project
 * @since 05/10/2023
 */
class Server {

    /**
     * @property app
     * @description the App instance
     * @private
     * @readonly
     * @type {App}
     */
    private readonly app: App

    /**
     * @property port
     * @description the port number of the application
     * @private
     * @readonly
     * @type {App}
     */
    private readonly port: string | number

    /**
     * @constructor
     */
    constructor() {
        this.app = new App()
        this.port = process.env.PORT
    }

    /**
     * @method serve
     * @description this method is used to serve the application
     * @public
     * @returns {void}
     */
    public readonly serve = (): void => {

        this.app.socketServer.on(SocketKeywords.connection, (socket: Socket) => {
            socket.on(SocketKeywords.join, (data) => {
                socket.join(data.chat_id);
            })
        })

        this.app.httpServer.listen(this.port, () => {
            console.log('HTTP server listening on port ' + this.port)
        })

    }
}

new Server().serve()
