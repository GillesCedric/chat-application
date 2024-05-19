/**
 * Middleware pour la protection contre les attaques CSRF (Cross-Site Request Forgery).
 * @module middlewares/CSRF
 */

import { Request, Response, NextFunction } from 'express';
import { Crypto } from '../modules/crypto/Crypto';
import { Code, Method } from '../utils/HTTP';
import { SessionModel } from '../models/Session';

export default class CSRF {

    /**
     * Middleware pour authentifier les requêtes et protéger contre les attaques CSRF.
     * @param request - L'objet requête Express.
     * @param response - L'objet réponse Express.
     * @param next - La fonction next à appeler pour passer au middleware suivant.
     * @returns Rien.
     */
    public static readonly authenticate = async (request: Request, response: Response, next: NextFunction): Promise<any> => {

        if (request.method == Method.get && request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) == 'form') {
            // Génération d'un jeton CSRF et sauvegarde en session
            const token = Crypto.randomBytes(24);
            const session = await SessionModel.findOne({
                userAgent: request.headers['user-agent'],
                validity: { $gt: new Date() }
            }).sort({ createdAt: -1 });

            const validity = new Date();
            validity.setMinutes(validity.getMinutes() + 30);

            if (session) {
                session.userAgent = request.headers['user-agent'];
                session.token = token;
                session.validity = validity;
                await session.save();
            } else {
                await SessionModel.insertMany({
                    userAgent: request.headers['user-agent'],
                    token: token,
                    validity: validity
                });
            }

            // Répond avec le jeton CSRF généré
            return response.status(Code.okay).json({
                message: "success",
                token: token
            });
        } else if (request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) == 'token' || request.method == Method.get) {
            // Permet d'accéder à l'endpoint 'token' ou les requêtes GET sans vérification CSRF
            next();
        } else {
            // Vérification du jeton CSRF dans le corps de la requête, l'en-tête et la session
            const tokenFromBodyOrQuery = request.body._csrf || request.query._csrf;
            const tokenFromHeader = request.headers['csrf-token'];
            const tokenFromSession = await SessionModel.findOne({
                userAgent: request.headers['user-agent'],
                token: tokenFromHeader,
                validity: { $gt: new Date() }
            }).sort({ createdAt: -1 });

            if (tokenFromBodyOrQuery &&
                tokenFromHeader &&
                tokenFromSession &&
                tokenFromBodyOrQuery === tokenFromSession.token &&
                tokenFromBodyOrQuery === tokenFromHeader) {
                next(); // Autorise la requête si les jetons correspondent
            } else {
                return response.status(403).json({ error: 'Invalid CSRF token' }); // Rejet de la requête si le jeton est invalide
            }
        }

    }

}
