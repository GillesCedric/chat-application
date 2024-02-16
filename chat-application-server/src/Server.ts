import { Socket } from 'socket.io'
import App from './App'
import { SocketKeywords } from './utils/Keywords'

class Server {

    private readonly app: App

    private readonly port: string | number

    constructor() {
        this.app = new App()
        this.port = process.env.API_GW_PORT
    }

    public readonly serve = (): void => {

        this.app.webServer.listen(this.port, () => {
            console.log('Gateway API Server listening on port ' + this.port)
        })

    }
}

new Server().serve()
