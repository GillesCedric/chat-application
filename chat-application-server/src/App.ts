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

        dotenv.config({
            path: fs.existsSync(path.join(path.dirname(process.cwd()), '.env.development')) ? path.join(path.dirname(process.cwd()), '.env.development') : path.join(path.dirname(process.cwd()), '.env')

        })

        this.config()

    }

    private readonly config = (): void => {

        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        //cors configuration
        this.app.use(cors({
            origin: process.env.DOMAIN_NAME,
        }))

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
                httpOnly: process.env.NODE_ENV == 'production',
                maxAge: 2 * 60 * 60 * 1000, //2h,
                domain: process.env.DOMAIN_NAME,
                path: "/",
                sameSite: process.env.NODE_ENV == 'production',
            }
        }))


        this.app.use(rateLimit({
            windowMs: 10 * 60 * 1000, // 10 minutes
            limit: 100, // 5 calls,
            standardHeaders: 'draft-7',
            legacyHeaders: false,
        }))

        this.app.use((req, res, next) => {
            console.log(req.session); // Cela devrait afficher l'objet de session
            next();
        });

        this.app.use(BasicAuthentication.authenticate)

        Proxy.serve(this.app)

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
            .connect(process.env.DATABASE_URL)
            .then(() => console.log("connected to mongodb"))
            .catch((err) => console.log("can't connect to mongodb: ", err));

        this._socketServer = new SocketServer(this._webServer, {
            cors: {
                origin: process.env.DOMAIN_NAME,
            }
        })

        this.socketServer.use(Socket.serve)

    }

}
