import App from './App'
import CONFIG from '../../config/services.json'

class Server {

    private readonly app: App

    private readonly port: string | number


    /**
     * @constructor
     */
    constructor() {
        this.app = new App()
        this.port = CONFIG.filter(service => service.name == "user")[0].port
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            console.log('User Service listening on port ' + this.port)
        })

    }
}

new Server().serve()
