import { Request, Response, NextFunction } from 'express'
import { Crypto } from '../modules/crypto/Crypto'
import { Code } from '../utils/HTTP'


export default class BasicAuthentication {

    public static readonly authenticate = (request: Request, response: Response, next: NextFunction): any => {

        if (request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) == 'email') {
            next()
        } else {
            // check for basic auth header
            if (request.headers.authorization && request.headers.authorization.indexOf('Basic ') != -1) {
                const authorization = Crypto.atob(request.headers.authorization.split(' ')[1]).split(':')
                if (authorization[0] == process.env.BASIC_APP_USERNAME && authorization[1] == process.env.BASIC_APP_PASSWORD)
                    next()
                else
                    return response.status(Code.unauthorized).json({ error: 'Incorrect Authorization Header' });
            } else {
                return response.status(Code.unauthorized).json({ error: 'Missing Authorization Header' });
            }
        }

    }

}
