/**
 * Cette classe configure les middlewares de proxy pour rediriger les requêtes vers différents services.
 * 
 * @module services/api-gateway/Proxy
 * 
 */
import { Services } from "../../utils/Keywords";
import { Application } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { httpsAgent, protocol } from '../../utils/HTTP';
import SERVICES from '../../config/services.json';
import CONFIG from '../../config/config.json';

/**
 * @class Proxy
 * @description Cette classe configure les middlewares de proxy pour rediriger les requêtes vers différents services.
 * @exports Proxy
 */
export default class Proxy {

	/**
	 * Configure les routes de l'application pour utiliser des proxys vers différents services.
	 * @function serve
	 * @static
	 * @param {Application} app - L'application Express.
	 * @returns {void}
	 */
	public static readonly serve = (app: Application): void => {

		app.use('/api/v1/users', createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.user].domain}:${SERVICES[process.env.NODE_ENV][Services.user].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/users': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}));

		app.use('/api/v1/chats', createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.chat].domain}:${SERVICES[process.env.NODE_ENV][Services.chat].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/chats': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}));

		app.use('/api/v1/notifications', createProxyMiddleware({
			target: `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.notification].domain}:${SERVICES[process.env.NODE_ENV][Services.notification].port}`,
			changeOrigin: true,
			pathRewrite: { '^/api/v1/notifications': '' },
			onProxyReq: fixRequestBody,
			secure: true,
			agent: process.env.NODE_ENV == 'production' ? httpsAgent(Services.apigw) : undefined
		}))

	};
}
