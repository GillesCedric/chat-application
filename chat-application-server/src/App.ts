import * as express from 'express'
import * as bodyParser from "body-parser"
import * as cors from "cors"
import * as dotenv from 'dotenv'
import helmet from "helmet"
import * as path from 'path'
import * as fs from 'fs'
import { createServer as createHTTPServer, Server as HTTPServer } from "http"
import { createServer as createHTTPSServer, Server as HTTPSServer } from "https"
import { createServer as createTLSServer, Server as TLSServer } from "tls"
import { Server as SocketServer } from "socket.io"
import mongoose from 'mongoose'


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

    /**
     * @method config
     * @description this method is used to Initialize the basic config of the application
     * @readonly
     * @private
     * @returns {void}
     */
    private readonly config = (): void => {
        //security configuration with helmet
        this.app.use(helmet())

        //body parser configuration
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))

        //cors configuration
        this.app.use(cors({
            origin: process.env.FRONT_URL,
        }))

        // serving static files 
        this.app.use(express.static('public'))

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
                origin: process.env.FRONT_URL,
            },
        });

    }

}
