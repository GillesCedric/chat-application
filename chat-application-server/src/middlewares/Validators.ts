import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'
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
        body('username', 'username must contains at least 6 characters, without spaces and specials characters').escape().trim().stripLow().isAlphanumeric().isLength({ min: 6 }),
        body('tel').escape().trim().stripLow().isMobilePhone('fr-FR'),
        body('email').escape().trim().stripLow().isEmail(),
        body('password', 'Password must contains al least 8 characters, 1 lowercase, 1 uppercase and 1 symbol').escape().trim().stripLow().isStrongPassword(),
        body('publicKey').notEmpty(),
    ]

    public static readonly signIn = [
        body('email').escape().trim().stripLow().isEmail(),
        body('password').escape().trim().stripLow().isStrongPassword(),
    ]

    public static readonly signOut = [
        body('access_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly sendFriendRequest = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('username').escape().trim().stripLow().isAlphanumeric().isLength({ min: 6 }),
        body('content').trim().stripLow().isLength({ min: 0, max: 100 }),
    ]

    public static readonly getUserFriendRequests = [
        query('access_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly updateFriendRequest = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('status').escape().trim().stripLow().isAlpha().isUppercase(),
        param('id').escape().trim().stripLow().isMongoId(),
    ]

    public static readonly updateTokens = [
        body('refresh_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly isValidTokens = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('refresh_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly me = [
        query('access_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly updateProfile = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('firstname').escape().trim().stripLow().isAlphanumeric().notEmpty().optional(),
        body('lastname').escape().trim().stripLow().isAlphanumeric().notEmpty().optional(),
        body('username', 'username must contains at least 6 characters, without spaces and specials characters').escape().trim().stripLow().isAlphanumeric().isLength({ min: 6 }).optional(),
        body('password', 'Password must contains al least 8 characters, 1 lowercase, 1 uppercase and 1 symbol').escape().trim().stripLow().isStrongPassword().optional(),
        body('tel').escape().trim().stripLow().isMobilePhone('fr-FR').optional(),
        body('is2FAEnabled').escape().trim().stripLow().isBoolean().optional(),
    ]

    public static readonly activateEmail = [
        query('token').escape().trim().stripLow().isJWT()
    ]

    public static readonly activateTel = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('code').escape().trim().stripLow().isLength({ min: 6, max: 6 }).isNumeric()
    ]

    public static readonly verifyTel = [
        body('access_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly connect = [
        body('userId').trim().stripLow().notEmpty(),
        body('code').escape().trim().stripLow().isLength({ min: 6, max: 6 }).isNumeric()
    ]

    public static readonly checkUnique = [
        body('tel').escape().trim().stripLow().isMobilePhone('fr-FR').optional(),
        body('email').escape().trim().stripLow().isEmail().optional(),
        body('username').escape().trim().stripLow().isAlphanumeric().isLength({ min: 6 }).optional(),
    ]

}
export abstract class ChatValidators extends Validators {

    public static readonly addConversation = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('members').escape().trim().stripLow().isArray({ min: 2 }),
    ]

    public static readonly getUserConversations = [
        query('access_token').escape().trim().stripLow().isJWT(),
    ]

    public static readonly getUserConversationChats = [
        query('access_token').escape().trim().stripLow().isJWT(),
        param('id').escape().trim().stripLow().isMongoId(),
    ]

    public static readonly addChats = [
        body('access_token').escape().trim().stripLow().isJWT(),
        param('id').escape().trim().stripLow().isMongoId(),
        body('message').trim().stripLow().isLength({ min: 0, max: 500 }),
    ]

    public static readonly updateChat = [
        body('access_token').escape().trim().stripLow().isJWT(),
        param('id').escape().trim().stripLow().isMongoId(),
    ]

}

export abstract class NotificationValidators extends Validators {
    public static readonly sendNotification = [
        body('access_token').escape().trim().stripLow().isJWT(),
        body('receiver').escape().trim().stripLow().isMongoId(),
        body('content').trim().stripLow(),
    ]

    public static readonly updateNotification = [
        body('access_token').escape().trim().stripLow().isJWT(),
        param('id').escape().trim().stripLow().isMongoId(),
    ]

    public static readonly getNotifications = [
        query('access_token').escape().trim().stripLow().isJWT(),
    ]

}