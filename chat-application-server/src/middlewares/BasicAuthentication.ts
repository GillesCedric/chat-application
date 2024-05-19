/**
 * Middleware pour l'authentification de base.
 * @module middlewares/BasicAuthentication
 */
import { Request, Response, NextFunction } from 'express'
import { Crypto } from '../modules/crypto/Crypto'

/**
 * Middleware pour l'authentification de base.
 */
export default class BasicAuthentication {

    /**
     * Middleware pour authentifier les requêtes.
     * @param request - L'objet requête Express.
     * @param response - L'objet réponse Express.
     * @param next - La fonction next à appeler pour passer au middleware suivant.
     * @returns Rien.
     */
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
                    return response.status(401).json({ error: 'Incorrect Authorization Header' });
            } else {
                return response.status(401).json({ error: 'Missing Authorization Header' });
            }
        }

    }

}