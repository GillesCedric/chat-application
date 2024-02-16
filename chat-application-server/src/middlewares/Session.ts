import { Request, Response, NextFunction, Application } from 'express'
import { Crypto } from '../../../chat-application-client/src/modules/crypto/Crypto'


export default class Session {

    constructor() { }

    public static readonly serve = (req: Request, res: Response, next: NextFunction): any => {
        if (req.session && req.session['authenticated']) {
            if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'login') {
                res.status(401).json({message: 'already authenticated'})
            } else {
                next()
            }
        } else {
            if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'login') {
                req.session['authenticated'] = true
                next()
            } else {
                res.status(401).json({ message: 'unauthenticated' })
            }
        }
    }

}
