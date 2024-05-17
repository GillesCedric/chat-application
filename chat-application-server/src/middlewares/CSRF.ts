import { Request, Response, NextFunction } from 'express'
import { Crypto } from '../modules/crypto/Crypto'
import { Code, Method } from '../utils/HTTP'
import { SessionModel } from '../models/Session'
import { ApigwLogger as Logger } from '../modules/logger/Logger'


export default class CSRF {

    public static readonly authenticate = async (request: Request, response: Response, next: NextFunction): Promise<any> => {

        try {
            if (request.method == Method.get && request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) == 'form') {
                const token = Crypto.randomBytes(24)
                const session = await SessionModel.findOne({
                    userAgent: request.headers['user-agent'],
                    validity: { $gt: new Date() }
                }).sort({ createdAt: -1 })

                const validity = new Date()
                validity.setMinutes(validity.getMinutes() + 30)

                if (session) {
                    session.userAgent = request.headers['user-agent']
                    session.token = token
                    session.validity = validity
                    await session.save()
                } else {
                    await SessionModel.insertMany({
                        userAgent: request.headers['user-agent'],
                        token: token,
                        validity: validity
                    })
                }

                return response.status(Code.okay).json({
                    message: "success",
                    token: token
                })
            } else if (request.path.substring(request.path.lastIndexOf('/') + 1, request.path.length) == 'token' || request.method == Method.get) {
                next()
            } else {

                const tokenFromBodyOrQuery = request.body._csrf || request.query._csrf
                const tokenFromHeader = request.headers['csrf-token']
                const tokenFromSession = await SessionModel.findOne({
                    userAgent: request.headers['user-agent'],
                    token: tokenFromHeader,
                    validity: { $gt: new Date() }
                }).sort({ createdAt: -1 })

                if (tokenFromBodyOrQuery &&
                    tokenFromHeader &&
                    tokenFromSession &&
                    tokenFromBodyOrQuery === tokenFromSession.token &&
                    tokenFromBodyOrQuery === tokenFromHeader) {
                    next()
                } else {
                    return response.status(Code.badRequest).json({ error: 'Invalid CSRF token , please reload this page and try again !' })
                }
            }
        } catch (error) {
            Logger.error(error)
            return response.status(Code.internalError).json({ error: "Erreur lors de la vérification des informations, veuillez rééssayer plus tard" })
        }

    }

}
