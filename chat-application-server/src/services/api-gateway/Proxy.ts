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

		app.use('/api/v1/users', Session.authenticate, createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.user].domain}:${SERVICES[process.env.NODE_ENV][Services.user].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/users': '' },
			selfHandleResponse: true,
			onProxyReq: (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {

				fixRequestBody(proxyReq, req)

				const expressReq = req as unknown as Express.Request

				if (expressReq.session['token'])
					proxyReq.setHeader('Authorization', `Bearer ${expressReq.session['token']}`)
			},
			onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
				const response = JSON.parse(responseBuffer.toString('utf8'))
				if (response.token) {

					const expressReq = req as unknown as Express.Request

					expressReq.session['token'] = response.token
					await new Promise<void>((resolve, reject) => {
						expressReq.session.save((err: any) => err ? reject(err) : resolve())
					})

					delete response.token
				}

				return JSON.stringify(response)
			}),
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}))

		app.use('/api/v1/chats', Session.authenticate, createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.chat].domain}:${SERVICES[process.env.NODE_ENV][Services.chat].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/chats': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}))

	};
}