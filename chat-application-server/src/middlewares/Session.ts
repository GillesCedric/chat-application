import { Request, Response, NextFunction } from 'express'
import JWTUtils from '../modules/jwt/JWT'
import { Services, Tokens } from '../utils/Keywords'
import { Method, protocol } from '../utils/HTTP'
import SERVICES from '../config/services.json'


export default class Session {

  public static readonly authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log(req.headers['user-agent'])
    if ((req.body.access_token && await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], Tokens.accessToken) != undefined) || (req.query.access_token && await JWTUtils.getUserFromToken(req.query.access_token as string, req.headers['user-agent'], Tokens.accessToken) != undefined)) {
      if (req.path.substring(req.path.indexOf('/') + 1, req.path.length) == 'images') {
        return next()
      } else if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin') {
        return res.status(401).json({ error: 'already authenticated' })
      } else {
        return next()
      }
    } else if (
      (
        (req.body.refresh_token && await JWTUtils.getUserFromToken(req.body.refresh_token, req.headers['user-agent'], Tokens.refreshToken) != undefined) ||
        (req.query.refresh_token && await JWTUtils.getUserFromToken(req.query.refresh_token as string, req.headers['user-agent'], Tokens.refreshToken) != undefined)
      ) &&
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'token') {
      return next()
    } else if (
      //Add some routes here to bypass token authentication
      req.path.substring(req.path.lastIndexOf("/") + 1, req.path.length) ==
      "signin" ||
      req.path.substring(req.path.lastIndexOf("/") + 1, req.path.length) ==
      "signup" ||
      req.path.substring(req.path.lastIndexOf("/") + 1, req.path.length) ==
      "checkUnique" ||
      req.path.substring(req.path.lastIndexOf("/") + 1, req.path.length) ==
      "connect" ||
      req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) ==
      'email'
    ) {
      return next();
    } else {
      return res.status(401).json({ error: "unauthenticated" });
    }

  }

}
