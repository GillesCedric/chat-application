import * as express from 'express'
import * as bodyParser from "body-parser"
import * as cors from "cors"
import * as dotenv from 'dotenv'
import helmet from "helmet"
import * as path from 'path'
import * as fs from 'fs'
import { createServer as createHTTPServer, Server as HTTPServer } from "http"
import { createServer as createTLSServer, Server as TLSServer } from "tls"
import mongoose from 'mongoose'
import Routes from './routes/Routes'


export default class App {

    private readonly _app: express.Application = express()

    private _httpServer: HTTPServer

    private _tlsServer: TLSServer

    private _internalServer: HTTPServer | TLSServer

    private readonly _routes: Routes = new Routes()

    public get internalServer(): HTTPServer | TLSServer {
        return process.env.NODE_ENV == "development" ? this._httpServer : this._tlsServer
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

        this._routes.routes(this.app)

    }

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

        this._internalServer = process.env.NODE_ENV == "development" ? createHTTPServer(this.app) : createTLSServer()

        //connection to the database
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => console.log("connected to mongodb"))
            .catch((err) => console.log("can't connect to mongodb: ", err));

    }

}
