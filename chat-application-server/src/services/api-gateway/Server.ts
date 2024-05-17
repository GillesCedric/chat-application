import App from './App'
import { Services, SocketKeywords, Tokens } from '../../utils/Keywords'
import { ApigwLogger as Logger } from '../../modules/logger/Logger'
import SERVICES from '../../config/services.json'


class Server {

    private readonly app: App

    private readonly port: string | number

    constructor() {
        this.app = new App()
        this.port = SERVICES[process.env.NODE_ENV][Services.apigw].port
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            Logger.log('Gateway API Server listening on port ' + this.port)
        })

    }
}

new Server().serve()
