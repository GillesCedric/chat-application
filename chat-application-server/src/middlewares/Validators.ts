import { Request, Response, NextFunction } from 'express'
import { ValidationChain, body, validationResult } from 'express-validator'
import { Code } from '../utils/HTTP'


export default class Validators {

    public static readonly errors = (req: Request, res: Response, next: NextFunction): Response => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
            return res.status(Code.badRequest).json({ errors: errors.array() })
        }

    }

    public static readonly signUp = [

        body('firstname').escape().trim().stripLow().isAlphanumeric().notEmpty(),
        body('lastname').escape().trim().stripLow().isAlphanumeric().notEmpty(),
        body('username', 'username must contains at least 6 characters').escape().trim().stripLow().isAlphanumeric().isLength({ min: 6 }),
        body('tel').escape().trim().stripLow().isMobilePhone('fr-FR'),
        body('email').escape().trim().stripLow().isEmail(),
        body('password', 'Password must contains al least 8 characters, 1 lowercase, 1 uppercase and 1 symbol').escape().trim().stripLow().isStrongPassword(),
    ]

    public static readonly signIn = [
        body('email').escape().trim().stripLow().isEmail(),
        body('password').escape().trim().stripLow(),
    ]

}
