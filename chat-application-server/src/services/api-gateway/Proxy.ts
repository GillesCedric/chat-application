import { Services } from "../../utils/Keywords"
import { Application } from "express"
import { createProxyMiddleware, fixRequestBody, responseInterceptor } from "http-proxy-middleware"
import http from 'http'
import Session from '../../middlewares/Session'
import { httpsAgent, protocol } from '../../utils/HTTP'
import SERVICES from '../../config/services.json'
import CONFIG from '../../config/config.json'

export default class Proxy {

	public static readonly serve = (app: Application): void => {

		app.use('/api/v1/users', createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.user].domain}:${SERVICES[process.env.NODE_ENV][Services.user].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/users': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}))

		app.use('/api/v1/chats', createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.chat].domain}:${SERVICES[process.env.NODE_ENV][Services.chat].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/chats': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}))

		app.use('/api/v1/notifications', createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.notification].domain}:${SERVICES[process.env.NODE_ENV][Services.notification].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/notifications': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.notification) : undefined
		}))

	};
}
