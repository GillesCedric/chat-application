import App from './App'
import * as CONFIG from '../../config/services.json'

class Server {

    private readonly app: App

    private readonly port: string | number


    /**
     * @constructor
     */
    constructor() {
        this.app = new App()
        this.port = CONFIG.filter(service => service.name == "chat")[0].port
    }

    /**
     * @method serve
     * @description this method is used to serve the application
     * @public
     * @returns {void}
     */
    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            console.log('Chat Service Server listening on port ' + this.port)
        })

    }
}

new Server().serve()
