import * as express from 'express'
import * as bodyParser from "body-parser"
import * as cors from "cors"
import helmet from "helmet"
import * as dotenv from "dotenv"
import { createServer, Server as HTTPServer } from "http"
import { Server } from "socket.io";
import mongoose from 'mongoose'


/**
 * @class App
 * @author Gilles Cédric
 * @description this class is used to represent the express App instance
 * @exports
 * @default
 * @since 05/10/2023
 */
export default class BasicAuthentication {

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

    }

    /**
     * @method config
     * @description this method is used to Initialize the basic config of the application
     * @readonly
     * @private
     * @returns {void}
     */
    private readonly authenticate = (request: Request, response: Response, next: express.NextFunction): void => {
        // check for basic auth header
        if (!request.headers.has("authorization")  || request.headers.get("authorization").indexOf('Basic ') === -1) {
            //return response(401).json({ message: 'Missing Authorization Header' });
        }
    }

}
