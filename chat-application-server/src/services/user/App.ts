import express from 'express'
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from 'dotenv'
import helmet from "helmet"
import path from 'path'
import fs from 'fs'
import { createServer as createHTTPServer, Server as HTTPServer } from "http"
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https"
import mongoose from 'mongoose'
import Routes from './routes/Routes'
import { userLogger as Logger } from '../../modules/logger/Logger'
import { Method, protocol } from '../../utils/HTTP'
import Session from '../../middlewares/Session'
import BasicAuthentication from '../../middlewares/BasicAuthentication'
import { Services } from '../../utils/Keywords'



export default class App {

    private readonly _app: express.Application = express()

    private _httpServer: HTTPServer

    private _httpsServer: HTTPSServer

    public get webServer(): HTTPServer | HTTPSServer {
        return process.env.NODE_ENV == "development" ? this._httpServer : this._httpsServer
    }

    public get app(): express.Application {
        return this._app
    }

    constructor() {

        this.config()

        Routes.routes(this.app)

    }

    private readonly config = (): void => {

        if (!process.env.NODE_ENV || process.env.NODE_ENV == "development") {
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

        //this.app.use(cors())

        //cors configuration
        this.app.use(cors({
            origin: `${protocol()}://${process.env.CLIENT_URL}`, // Autorise uniquement les requêtes provenant de ce domaine
            methods: Object.values(Method), // Autorise uniquement les méthodes GET et POST
            credentials: true // Autorise l'envoi de cookies et d'autres informations d'authentification
        }))

        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        this.app.use(BasicAuthentication.authenticate)

        this.app.use(Session.authenticate)

        try {
            if (process.env.NODE_ENV == "development")
                this._httpServer = createHTTPServer(this._app)
            else
                this._httpsServer = createHTTPSServer({
                    requestCert: true,
                    rejectUnauthorized: true,
                    key: fs.readFileSync(path.join(process.cwd(), 'certs', Services.user, `${Services.user}-key.pem`)),
                    cert: fs.readFileSync(path.join(process.cwd(), 'certs', Services.user, `${Services.user}-cert.pem`)),
                    ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'ca', 'ca-cert.pem')),
                }, this._app)
        } catch (error) {
            Logger.error(error.message)
            process.exit(1)
        }

        //connection to the database
        try {
            mongoose
                .connect(process.env.DATABASE_URL)
                .then(() => Logger.log("connected to mongodb"))
                .catch((err) => Logger.error("can't connect to mongodb: " + err, 'error'));

        } catch (error) {
            Logger.error(error.message)
            process.exit(1)
        }

    }

}
