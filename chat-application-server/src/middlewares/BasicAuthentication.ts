import { Request, Response, NextFunction } from 'express'
import { Crypto } from '../utils/crypto/Crypto'


export default class BasicAuthentication {

    constructor() { }

    public static readonly authenticate = (request: Request, response: Response, next: NextFunction): any => {
        // check for basic auth header
        if (request.headers.authorization && request.headers.authorization.indexOf('Basic ') != -1) {
            const authorization = Crypto.atob(request.headers.authorization.split(' ')[1]).split(':')
            if (authorization[0] == process.env.BASIC_APP_USERNAME && authorization[1] == process.env.BASIC_APP_PASSWORD)
                next()
            else
                return response.status(401).json({ message: 'Incorrect Authorization Header' });
        } else {
            return response.status(401).json({ message: 'Missing Authorization Header' });
        }
    }

}
