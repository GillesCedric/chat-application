import * as express from 'express'
import * as bodyParser from "body-parser"
import * as cors from "cors"
import * as dotenv from 'dotenv'
import helmet from "helmet"
import * as path from 'path'
import * as fs from 'fs'
import { createServer, Server as HTTPServer } from "http"
import { Server as SocketServer } from "socket.io"
import mongoose from 'mongoose'
import Routes from './routes/Routes'
import BasicAuthentication from './middlewares/BasicAuthentication'



/**
 * @class App
 * @author Gilles Cédric
 * @description this class is used to represent the express App instance
 * @exports
 * @default
 * @since 05/10/2023
 */
export default class App {

    
    /**
     * @property _app
     * @description the express Application instance
     * @private
     * @readonly
     * @type {express.Application}
     */
    private readonly _app: express.Application = express()

    /**
     * @property _app
     * @description the express Application instance
     * @private
     * @readonly
     * @type {express.Application}
     */
    private _socketServer: SocketServer

    /**
     * @property _app
     * @description the express Application instance
     * @private
     * @readonly
     * @type {express.Application}
     */
    private _httpServer: HTTPServer

    /**
     * @property _routes
     * @description the Routes instance
     * @private
     * @readonly
     * @type {Routes}
     */
    private readonly _routes: Routes = new Routes()

    /**
     * @method get
     * @description this method is used to get a specific express Application instance
     * @public
     * @static
     * @returns {express.Application} the express Application instance
     */
    public get socketServer(): SocketServer {
        return this._socketServer
    }

    /**
     * @method get
     * @description this method is used to get a specific express Application instance
     * @public
     * @static
     * @returns {express.Application} the express Application instance
     */
    public get httpServer(): HTTPServer {
        return this._httpServer
    }

    /**
     * @method get
     * @description this method is used to get a specific express Application instance
     * @public
     * @static
     * @returns {express.Application} the express Application instance
     */
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

        this.app.use(BasicAuthentication.authenticate)

        this._httpServer = createServer(this.app)

        //connection to the database
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => console.log("connected to mongodb"))
            .catch((err) => console.log("can't connect to mongodb: ", err));

        this._socketServer = new SocketServer(this._httpServer, {
            cors: {
                origin: process.env.FRONT_URL,
            },
        });

    }

}
