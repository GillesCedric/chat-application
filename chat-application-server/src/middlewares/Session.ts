import { Request, Response, NextFunction } from 'express'


export default class Session {

    constructor() { }

    public static readonly authenticate = (req: Request, res: Response, next: NextFunction): any => {
        if (req.session && req.session['token']) {
            if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin') {
                res.status(401).json({message: 'already authenticated'})
            } else {
                next()
            }
        } else {
            if (req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signin' || req.path.substring(req.path.lastIndexOf('/') + 1, req.path.length) == 'signup') {
                next()
            } else {
                res.status(401).json({ message: 'unauthenticated' })
            }
        }
    }

}
