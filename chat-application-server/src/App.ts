import * as express from 'express'
import * as bodyParser from "body-parser"
import * as cors from "cors"
import helmet from "helmet"
import * as dotenv from "dotenv"
import {createServer, Server as HTTPServer} from "http"
import { Server } from "socket.io"
import mongoose from 'mongoose'


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
    private _socketServer: Server

    /**
     * @property _app
     * @description the express Application instance
     * @private
     * @readonly
     * @type {express.Application}
     */
    private _httpServer: HTTPServer

    /**
     * @method get
     * @description this method is used to get a specific express Application instance
     * @public
     * @static
     * @returns {express.Application} the express Application instance
     */
    public get socketServer(): Server {
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
            path: `.env.${process.env.NODE_ENV || "development"}`
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

        this._httpServer = createServer(this.app)

        //connection to the database
        mongoose
            .connect(process.env.MONGO_URL)
            .then(() => console.log("connected to mongodb"))
            .catch((err) => console.log("can't connect to mongodb: ", err));

        this._socketServer = new Server(this._httpServer, {
            cors: {
                origin: process.env.FRONT_URL,
            },
        });

    }

}
