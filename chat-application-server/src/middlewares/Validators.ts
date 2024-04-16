import { Request, Response, NextFunction } from 'express'
import { ValidationChain, body, param, validationResult } from 'express-validator'
import { Code } from '../utils/HTTP'


export default abstract class Validators {

    public static readonly errors = (req: Request, res: Response, next: NextFunction): Response => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
            return res.status(Code.badRequest).json({ errors: errors.array() })
        }

    }

}

export abstract class UserValidators extends Validators {

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
export abstract class ChatValidators extends Validators {

}

export abstract class NotificationValidators extends Validators {
    public static readonly sendNotification = [
        body('receiver').escape().trim().stripLow().isLength({
            min: 24,
            max: 24
        }),
        body('content').escape().trim().stripLow(),
    ]

    public static readonly updateNotification = [
        param('id').escape().trim().stripLow().isLength({
            min: 24,
            max: 24
        }),
    ]

}