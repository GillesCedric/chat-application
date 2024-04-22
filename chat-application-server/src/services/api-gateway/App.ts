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
import MongoStore from 'connect-mongo'
import rateLimit from 'express-rate-limit'
import Proxy from './Proxy'
import BasicAuthentication from '../../middlewares/BasicAuthentication'
import { apiGWLogger as Logger } from '../../modules/logger/Logger'
import { Method, protocol } from '../../utils/HTTP'
import Session from '../../middlewares/Session'
import { Services } from '../../utils/Keywords'


export default class App {

    private readonly _app: express.Application = express()

    private _socketServer: SocketServer

    private _httpServer: HTTPServer

    private _httpsServer: HTTPSServer

    private _webServer: HTTPServer | HTTPSServer

    public get socketServer(): SocketServer {
        return this._socketServer
    }

    public set socketServer(socketServer: SocketServer) {
        this._socketServer = socketServer
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

        // serving static files 
        this.app.use("/images", express.static('data/users'))

        try {
            const store = MongoStore.create({
                mongoUrl: process.env.DATABASE_URL,
            })

            // this.app.use(session({
            //     name: 'chat-application',
            //     secret: process.env.SESSION_SECRET,
            //     resave: false,
            //     saveUninitialized: true,
            //     store: store,
            //     cookie: {
            //         secure: process.env.NODE_ENV == 'production',
            //         httpOnly: true,
            //         maxAge: 30 * 24 * 1 * 60 * 60 * 1000, //30j, //should be the same as TOKEN_DELAY
            //         path: "/",
            //         sameSite: process.env.NODE_ENV == 'production',
            //         domain: `localhost`,
            //         //sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',//TODO test in production for potential bug
            //         signed: true
            //     }
            // }))
        } catch (error) {
            Logger.error(error.message)
            process.exit(1)
        }



        this.app.use(rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            limit: 100, // 100 calls,
            standardHeaders: 'draft-7',
            legacyHeaders: false,
        }))

        this.app.use(BasicAuthentication.authenticate)

        this.app.use(Session.authenticate)

        Proxy.serve(this.app)

        try {
            if (process.env.NODE_ENV == "development")
                //if (process.env.NODE_ENV == "production")
                this._httpServer = createHTTPServer(this._app)
            else
                this._httpsServer = createHTTPSServer({
                    key: fs.readFileSync(path.join(process.cwd(), 'certs', Services.apigw, `${Services.apigw}-key.pem`)),
                    cert: fs.readFileSync(path.join(process.cwd(), 'certs', Services.apigw, `${Services.apigw}-cert.pem`))
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
