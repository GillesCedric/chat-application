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
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { userLogger as Logger } from '../../modules/logger/Logger'
import { Method, protocol } from '../../utils/HTTP'
import Session from '../../middlewares/Session'
import BasicAuthentication from '../../middlewares/BasicAuthentication'



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

        try {
            Logger.config()
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

        //this.app.use(cors())

        //cors configuration
        this.app.use(cors({
            origin: `${protocol}://${process.env.CLIENT_URL}`, // Autorise uniquement les requêtes provenant de ce domaine
            methods: Object.values(Method), // Autorise uniquement les méthodes GET et POST
            credentials: true // Autorise l'envoi de cookies et d'autres informations d'authentification
        }))

        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        this.app.use(session({
            name: 'chat-application',
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL,
            }),
            cookie: {
                secure: process.env.NODE_ENV == 'production',
                httpOnly: process.env.NODE_ENV == 'production',
                maxAge: 4 * 60 * 60 * 1000, //4h, //should be the same as TOKEN_DELAY
                domain: process.env.CLIENT_URL,
                path: "/",
                sameSite: process.env.NODE_ENV == 'production',
            }
        }))

        this.app.use(BasicAuthentication.authenticate)

        this.app.use(Session.authenticate)

        if (process.env.NODE_ENV == "development")
            this._httpServer = createHTTPServer(this._app)
        else
            this._httpsServer = createHTTPSServer({
                requestCert: true,
                rejectUnauthorized: true,
                key: fs.readFileSync('chemin/vers/votre/cle_privee_client.key'),
                cert: fs.readFileSync('chemin/vers/votre/certificat_client.pem'),
                ca: fs.readFileSync('chemin/vers/ca_certificat_microservice.pem'),
            }, this._app)

        //connection to the database
        mongoose
            .connect(process.env.DATABASE_URL as string)
            .then(() => Logger.log("connected to mongodb"))
            .catch((err) => Logger.error("can't connect to mongodb: " + err))

    }

}