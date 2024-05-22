/**
 * Middleware pour l'authentification d'image.
 * @module middlewares/ImageAuthentication
 */

import { Request, Response, NextFunction } from 'express';
import { Crypto } from '../modules/crypto/Crypto';

export default class ImageAuthentication {

    /**
     * Middleware pour authentifier les requêtes d'image.
     * @param request - L'objet requête Express.
     * @param response - L'objet réponse Express.
     * @param next - La fonction next à appeler pour passer au middleware suivant.
     * @returns Rien.
     */
    public static readonly authenticate = (request: Request, response: Response, next: NextFunction): any => {

        // Vérifie si la requête est pour l'endpoint 'email'
        if (request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) == 'email') {
            next(); // Passe au middleware suivant si la requête concerne l'endpoint 'email'
        } else {
            // Vérifie la présence de l'en-tête d'authentification de base
            if (request.headers.authorization && request.headers.authorization.indexOf('Basic ') != -1) {
                // Extrait les informations d'identification de l'en-tête d'authentification
                const authorization = Crypto.atob(request.headers.authorization.split(' ')[1]).split(':');
                // Vérifie les informations d'identification par rapport aux valeurs attendues
                if (authorization[0] == process.env.BASIC_APP_USERNAME && authorization[1] == process.env.BASIC_APP_PASSWORD)
                    next(); // Autorise la requête si les informations d'identification sont correctes
                else
                    return response.status(401).json({ error: 'Incorrect Authorization Header' }); // Rejet de la requête si les informations d'identification sont incorrectes
            } else {
                return response.status(401).json({ error: 'Missing Authorization Header' }); // Rejet de la requête si l'en-tête d'authentification est manquant
            }
        }

    }

}
