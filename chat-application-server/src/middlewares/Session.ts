import { Request, Response, NextFunction } from 'express'
import JWTUtils from '../modules/jwt/JWT'
import { Services, Tokens } from '../utils/Keywords'
import { Method, protocol } from '../utils/HTTP'
import SERVICES from '../config/services.json'


export default class Session {

    public static readonly authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if (req.session && req.session['access_token'] && JWTUtils.getUserFromToken(req.session['access_token'], Tokens.accessToken) != undefined) {
            if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin') {
                return res.status(401).json({ message: 'already authenticated' })
            } else {
                return next()
            }
        } else if (req.session && req.session['refresh_token'] && JWTUtils.getUserFromToken(req.session['refresh_token'], Tokens.refreshToken) != undefined) {
            const request = await fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.user].domain}:${SERVICES[process.env.NODE_ENV][Services.user].port}/token`, {
                method: Method.post,
                headers: {
                    accept: "application/json",
                    'content-type': "application/json"
                },
                body: JSON.stringify({ refreshToken: req.session['refresh_token'] })
            })

            const response = await request.json()

            if (response.accessToken && response.refreshToken) {
                req.session['access_token'] = response.accessToken
                req.session['refresh_token'] = response.refreshToken
            } else {
                return res.status(401).json({ message: response.error })
            }

            return next()
        } else if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin' || req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signup') {

            return next()
        } else {
            return res.status(401).json({ message: 'unauthenticated' })
        }

    }

}
