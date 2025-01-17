import App from './App'
import SERVICES from '../../config/services.json'
import { userLogger as Logger } from '../../modules/logger/Logger'
import { Services } from '../../utils/Keywords'

class Server {

    private readonly app: App

    private readonly port: string | number


    /**
     * @constructor
     */
    constructor() {
        this.app = new App()
        this.port = SERVICES[process.env.NODE_ENV][Services.user].port
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            Logger.log('User Service listening on port ' + this.port)
        })

    }
}

new Server().serve()
