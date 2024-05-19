/**
 * Middleware pour l'authentification des sockets.
 * @module middlewares/SocketAuthentication
 */

import { Crypto } from '../modules/crypto/Crypto';
import JWTUtils from '../modules/jwt/JWT';
import { Tokens } from '../utils/Keywords';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

/**
 * Classe pour le middleware d'authentification des sockets.
 */
export default class SocketAuthentication {

    /**
     * Middleware pour authentifier les connexions de socket.
     * @param socket - L'objet socket.io représentant la connexion du client.
     * @param next - La fonction next à appeler pour passer au middleware suivant ou gérer une erreur.
     * @returns Rien.
     */
    public static readonly authenticate = async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, next: (err?: ExtendedError) => void): Promise<any> => {

        // Vérifie la présence de l'en-tête d'authentification de base
        if (socket.handshake.headers.authorization && socket.handshake.headers.authorization.indexOf('Basic ') != -1) {
            // Extrait les informations d'identification de l'en-tête d'authentification
            const authorization = Crypto.atob(socket.handshake.headers.authorization.split(' ')[1]).split(':');
            // Vérifie les informations d'identification par rapport aux valeurs attendues
            if (authorization[0] == process.env.BASIC_APP_USERNAME && authorization[1] == process.env.BASIC_APP_PASSWORD) {
                // Vérifie la présence et la validité du jeton d'authentification
                if (socket.handshake.headers.token) {
                    const userId = await JWTUtils.getUserFromToken(socket.handshake.headers.token as string, socket.handshake.headers['user-agent'] as string, Tokens.accessToken);
                    if (userId) {
                        socket.data.userId = userId;
                        next(); // Autorise la connexion du socket si le jeton est valide
                    } else {
                        return next(new Error('Incorrect Authentication Token')); // Rejet de la connexion si le jeton est incorrect
                    }
                } else {
                    return next(new Error('Missing Authentication Token')); // Rejet de la connexion si le jeton est manquant
                }
            } else {
                return next(new Error('Incorrect Authorization Token')); // Rejet de la connexion si les informations d'identification sont incorrectes
            }
        } else {
            return next(new Error('Missing Authorization Token')); // Rejet de la connexion si l'en-tête d'authentification est manquant
        }
    }
}
