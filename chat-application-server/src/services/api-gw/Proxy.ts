import { Socket as WebSocket, } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { SocketKeywords } from "../../utils/Keywords";
import { Application } from "express";
import { RequestHandler, createProxyMiddleware, fixRequestBody, responseInterceptor } from "http-proxy-middleware";
import Session from '../../middlewares/Session'




export default class Proxy {

	public static readonly serve = (app: Application): void => {

		app.use('/api/v1/users', Session.authenticate, createProxyMiddleware({
			target: 'http://localhost:6001',
			changeOrigin: true,
			pathRewrite: { '^/api/v1/users': '' },
			onProxyReq: fixRequestBody
		}))

		app.use('/api/v1/chats', Session.authenticate, createProxyMiddleware({
			target: 'http://localhost:6000',
			changeOrigin: true,
			pathRewrite: { '^/api/v1/chats': '' },
			onProxyReq: fixRequestBody
		}))

	};
}
