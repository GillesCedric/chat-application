/**
 * Middleware pour l'authentification de base.
 * @module middlewares/BasicAuthentication
 */

import { Request, Response, NextFunction } from 'express';
import { Crypto } from '../modules/crypto/Crypto';

/**
 * Classe représentant le middleware pour l'authentification de base.
 * Cette classe fournit une méthode statique pour authentifier les requêtes HTTP en utilisant l'authentification basique.
 */
export default class BasicAuthentication {

    /**
     * Middleware pour authentifier les requêtes.
     * Cette méthode vérifie si l'en-tête d'authentification de base est présent et valide.
     * Si l'en-tête est valide, la requête passe au middleware suivant.
     * Si l'en-tête est manquant ou incorrect, une réponse 401 Unauthorized est envoyée.
     *
     * @param {Request} request - L'objet requête Express.
     * @param {Response} response - L'objet réponse Express.
     * @param {NextFunction} next - La fonction next à appeler pour passer au middleware suivant.
     * @returns {void} Rien.
     *
     * @example
     * // Utilisation dans une route Express
     * import express from 'express';
     * import BasicAuthentication from './middlewares/BasicAuthentication';
     *
     * const app = express();
     *
     * app.use(BasicAuthentication.authenticate);
     *
     * app.get('/protected', (req, res) => {
     *   res.send('Cette route est protégée par l\'authentification de base');
     * });
     *
     * app.listen(3000, () => {
     *   console.log('Serveur démarré sur le port 3000');
     * });
     */
    public static readonly authenticate = (request: Request, response: Response, next: NextFunction): void => {
        if (request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) === 'email') {
            next();
        } else {
            // Vérifie la présence de l'en-tête d'authentification basique
            if (request.headers.authorization && request.headers.authorization.indexOf('Basic ') !== -1) {
                const authorization = Crypto.atob(request.headers.authorization.split(' ')[1]).split(':');
                if (authorization[0] === process.env.BASIC_APP_USERNAME && authorization[1] === process.env.BASIC_APP_PASSWORD) {
                    next();
                } else {
                    response.status(401).json({ error: 'Incorrect Authorization Header' });
                }
            } else {
                response.status(401).json({ error: 'Missing Authorization Header' });
            }
        }
    }
}
