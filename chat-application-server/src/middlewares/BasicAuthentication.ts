import * as express from 'express'
import { createServer, Server as HTTPServer } from "http"


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
     * @constructor
     */
    constructor() {


    }

    /**
     * @method config
     * @description this method is used to Initialize the basic config of the application
     * @readonly
     * @private
     * @returns {void}
     */
    public static readonly authenticate = (request: express.Request, response: express.Response, next: express.NextFunction): any => {
        // check for basic auth header
        if (request.headers.authorization && request.headers.authorization.indexOf('Basic ') != -1) {
            const authorization = request.headers.authorization.split(' ')[1].split(':')
            console.log(request.headers.authorization)
            if(authorization[0] == process.env.CLIENT_USERNAME && authorization[1] == process.env.CLIENT_PASSWORD)
                next()
            else
                return response.status(401).json({ message: 'Incorrect Authorization Header' });
        }else{
            return response.status(401).json({ message: 'Missing Authorization Header' });
        }
    }

}
