import express from 'express'
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from 'dotenv'
import helmet from "helmet"
import path from 'path'
import fs from 'fs'
import { createServer as createHTTPServer, Server as HTTPServer } from "http"
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https"
import { Server as SocketServer } from "socket.io"
import Socket from './Socket'
import BasicAuthentication from '../../middlewares/BasicAuthentication'
import { socketLogger as Logger } from '../../modules/logger/Logger'
import { Method, protocol } from '../../utils/HTTP'
import Session from '../../middlewares/Session'
import { Services } from '../../utils/Keywords'
import rateLimit from 'express-rate-limit'


export default class App {

    private readonly _app: express.Application = express()

    private _socketServer: SocketServer

    private _httpServer: HTTPServer

    private _httpsServer: HTTPSServer

    private _webServer: HTTPServer | HTTPSServer

    public get socketServer(): SocketServer {
        return this._socketServer
    }

    public get webServer(): HTTPServer | HTTPSServer {
        return process.env.NODE_ENV == "development" ? this._httpServer : this._httpsServer
        //return this._httpServer
    }

    public get app(): express.Application {
        return this._app
    }

    /**
     * @constructor
     */
    constructor() {

        this.config()

    }

    private readonly config = (): void => {

        if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == "development") {

            try {

                dotenv.config({
                    path: fs.existsSync(path.join(process.cwd(), '.env.development')) ? path.join(process.cwd(), '.env.development') : path.join(process.cwd(), '.env')
                })
            } catch (error) {
                console.error(error)
                process.exit(1)
            }

        }

        try {
            Logger.config()
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

        //cors configuration
        this.app.use(cors({
            //origin: `${protocol()}://${process.env.CLIENT_URL}`, // Autorise uniquement les requêtes provenant de ce domaine
            origin: '*',
            methods: Object.values(Method), // Autorise uniquement les méthodes GET et POST
            credentials: true // Autorise l'envoi de cookies et d'autres informations d'authentification
        }))

        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        //TODO refexion about the rate limit of the notification service
        this.app.use(rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            limit: 100, // 100 calls,
            standardHeaders: 'draft-7',
            legacyHeaders: false,
        }))

        this.app.use(BasicAuthentication.authenticate)

        this.app.use(Session.authenticate)

        try {
            if (process.env.NODE_ENV == "development")
                //if (process.env.NODE_ENV == "production")
                this._httpServer = createHTTPServer(this._app)
            else
                this._httpsServer = createHTTPSServer({
                    key: fs.readFileSync(path.join(process.cwd(), 'certs', Services.socket, `${Services.socket}-key.pem`)),
                    cert: fs.readFileSync(path.join(process.cwd(), 'certs', Services.socket, `${Services.socket}-cert.pem`))
                }, this._app)
        } catch (error) {
            Logger.error(error.message)
            process.exit(1)
        }

        this._socketServer = new SocketServer(this._webServer, {
            cors: {
                origin: `${protocol()}://${process.env.CLIENT_URL}`
            }
        })

        this.socketServer.use(Socket.serve)

    }

}