import { Socket } from 'socket.io'
import App from './App'
import { Services, SocketKeywords } from '../../utils/Keywords'
import { apiGWLogger as Logger } from '../../modules/logger/Logger'
import SERVICES from '../../config/services.json'

class Server {

    private readonly app: App

    private readonly port: string | number

    constructor() {
        this.app = new App()
        this.port = SERVICES.filter(service => service.name == Services.apigw)[0].port
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            Logger.log('Gateway API Server listening on port ' + this.port)
        })

    }
}

new Server().serve()
