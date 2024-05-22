/**
 * Middleware pour la gestion de session et l'authentification.
 * @module middlewares/Session
 */

import { Request, Response, NextFunction } from 'express';
import JWTUtils from '../modules/jwt/JWT';
import { Tokens } from '../utils/Keywords';
import { Method } from '../utils/HTTP';

/**
 * Classe pour le middleware de gestion de session et d'authentification.
 */
export default class Session {

  /**
   * Middleware pour authentifier les requêtes et gérer les sessions.
   * @param req - L'objet requête Express.
   * @param res - L'objet réponse Express.
   * @param next - La fonction next à appeler pour passer au middleware suivant.
   * @returns Rien.
   */
  public static readonly authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    console.log(req.headers['user-agent']);

    // Vérifie si un jeton d'accès est fourni dans le corps de la requête ou dans la requête GET
    if ((req.body.access_token && await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], Tokens.accessToken) !== undefined) || (req.query.access_token && await JWTUtils.getUserFromToken(req.query.access_token as string, req.headers['user-agent'], Tokens.accessToken) !== undefined)) {
      // Autorise l'accès aux images sans vérification supplémentaire
      if (req.path.substring(req.path.indexOf('/') + 1, req.path.length) == 'images') {
        return next();
      } else if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin') {
        return res.status(401).json({ error: 'already authenticated' }); // Rejet de la requête si elle concerne l'endpoint 'signin' et que l'utilisateur est déjà authentifié
      } else {
        return next(); // Autorise l'accès aux autres endpoints
      }
    } else if (
      (
        (req.body.refresh_token && await JWTUtils.getUserFromToken(req.body.refresh_token, req.headers['user-agent'], Tokens.refreshToken) !== undefined) ||
        (req.query.refresh_token && await JWTUtils.getUserFromToken(req.query.refresh_token as string, req.headers['user-agent'], Tokens.refreshToken) !== undefined)
      ) &&
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'token') {
      return next(); // Autorise l'accès à l'endpoint 'token' si un jeton de rafraîchissement valide est fourni
    } else if (
      // Ajoutez ici les routes pour lesquelles l'authentification par jeton n'est pas nécessaire
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin' ||
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signup' ||
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'checkUnique' ||
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'connect' ||
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'email'
    ) {
      return next(); // Autorise l'accès aux endpoints spécifiés sans authentification par jeton
    } else {
      return res.status(401).json({ error: 'unauthenticated' }); // Rejet de la requête si l'utilisateur n'est pas authentifié
    }
  }
}
