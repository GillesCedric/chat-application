import App from './App'
import { Services, SocketKeywords } from '../../utils/Keywords'
import { socketLogger as Logger } from '../../modules/logger/Logger'
import SERVICES from '../../config/services.json'
import { Server as SocketServer } from "socket.io"
import Socket from './Socket'
import SocketAuthentication from '../../middlewares/SocketAuthentication'

class Server {

    private readonly app: App

    private readonly port: string | number

    constructor() {
        this.app = new App()
        this.port = SERVICES[process.env.NODE_ENV][Services.socket].port
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            Logger.log('Socket Service listening on port ' + this.port)
        })

        this.app.socketServer = new SocketServer(this.app.webServer, {
            cors: {
                origin: `*`
            }
        })

        // Middleware pour vérifier le token Bearer
        this.app.socketServer.use(SocketAuthentication.authenticate)

        Socket.serve(this.app.socketServer)

    }
}

new Server().serve()
