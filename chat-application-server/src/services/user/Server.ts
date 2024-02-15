import App from './App'

class Server {

    private readonly app: App

    private readonly internalPort: string | number

    constructor() {
        this.app = new App()
        this.internalPort = process.env.CHAT_SERVICE_PORT
    }

    public readonly serve = (): void => {


        this.app.internalServer.listen(this.internalPort, () => {
            console.log('Internal Server listening on port ' + this.internalPort)
        })

    }
}

new Server().serve()
