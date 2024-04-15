import { Socket } from 'socket.io'
import App from './App'
import { Services, SocketKeywords } from '../../utils/Keywords'
import { socketLogger as Logger } from '../../modules/logger/Logger'
import SERVICES from '../../config/services.json'

class Server {

    private readonly app: App

    private readonly port: string | number

    constructor() {
        this.app = new App()
        this.port = SERVICES[process.env.NODE_ENV][Services.socket].port
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            Logger.log('Socket Server listening on port ' + this.port)
        })

    }
}

new Server().serve()
