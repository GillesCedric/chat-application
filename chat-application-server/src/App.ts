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
import session from "express-session"
import mongoose from 'mongoose'
import Socket from './Socket'
import MongoStore from 'connect-mongo'
import rateLimit from 'express-rate-limit'
import Proxy from './Proxy'
import BasicAuthentication from './middlewares/BasicAuthentication'
import { apiGWLogger as Logger } from './modules/logger/Logger'


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

        dotenv.config({
            path: fs.existsSync(path.join(process.cwd(), '.env.development')) ? path.join(process.cwd(), '.env.development') : path.join(process.cwd(), '.env')

        })

        Logger.config()

        //cors configuration
        this.app.use(cors({
            origin: 'http://localhost:3000', // Autorise uniquement les requêtes provenant de ce domaine
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autorise uniquement les méthodes GET et POST
            credentials: true // Autorise l'envoi de cookies et d'autres informations d'authentification
        }))

        //this.app.use(cors())

        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        // serving static files 
        this.app.use(express.static('public'))

        this.app.use(session({
            name: 'chat-application',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL,
            }),
            cookie: {
                secure: process.env.NODE_ENV == 'production',
                httpOnly: true,
                maxAge: 4 * 60 * 60 * 1000, //4h, //should be the same as TOKEN_DELAY
                domain: process.env.DOMAIN_NAME,
                path: "/api/v1",
                sameSite: process.env.NODE_ENV == 'production',
                signed: true
            }
        }))


        this.app.use(rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            limit: 100, // 100 calls,
            standardHeaders: 'draft-7',
            legacyHeaders: false,
        }))

        this.app.use(BasicAuthentication.authenticate)

        Proxy.serve(this.app)

        if (process.env.NODE_ENV == "development")
            this._httpServer = createHTTPServer(this._app)
        else
            this._httpsServer = createHTTPSServer({
                key: fs.readFileSync('chemin/vers/votre/cle_privee_client.key'),
                cert: fs.readFileSync('chemin/vers/votre/certificat_client.pem'),
            }, this._app)


        //connection to the database
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => Logger.log("connected to mongodb"))
            .catch((err) => Logger.log("can't connect to mongodb: " + err, 'error'));

        this._socketServer = new SocketServer(this._webServer, {
            cors: {
                origin: process.env.DOMAIN_NAME,
            }
        })

        this.socketServer.use(Socket.serve)

    }

}
