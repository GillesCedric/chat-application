import { Socket } from 'socket.io'
import App from './App'
import { SocketKeywords } from './utils/Keywords'

class Server {

    private readonly app: App

    private readonly port: string | number


    /**
     * @constructor
     */
    constructor() {
        this.app = new App()
        this.port = process.env.API_GW_PORT
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
                console.log(`client ${data.chat_id} joined`)
            })
        })

        this.app.webServer.listen(this.port, () => {
            console.log('Gateway API Server listening on port ' + this.port)
        })
        console.log('test')


    }
}

new Server().serve()
