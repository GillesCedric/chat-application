import { Crypto } from '../modules/crypto/Crypto'
import JWTUtils from '../modules/jwt/JWT'
import { Tokens } from '../utils/Keywords'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'


export default class SocketAuthentication {

    public static readonly authenticate = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, next: (err?: ExtendedError) => void): any => {

        // check for basic auth header
        if (socket.handshake.headers.authorization && socket.handshake.headers.authorization.indexOf('Basic ') != -1) {
            const authorization = Crypto.atob(socket.handshake.headers.authorization.split(' ')[1]).split(':')
            if (authorization[0] == process.env.BASIC_APP_USERNAME && authorization[1] == process.env.BASIC_APP_PASSWORD) {
                if (socket.handshake.headers.token) {
                    const userId = JWTUtils.getUserFromToken(socket.handshake.headers.token as string, Tokens.accessToken)
                    if (userId) {
                        socket.data.userId = userId
                        next()
                    } else {
                        return next(new Error('Incorrect Authentication Token'))
                    }
                } else {
                    return next(new Error('Missing Authentication Token'))
                }
            } else
                return next(new Error('Incorrect Authorization Token'))
        } else {
            return next(new Error('Missing Authorization Token'))
        }


    }

}
