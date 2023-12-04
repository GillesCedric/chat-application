import { NextResponse, type NextRequest } from 'next/server'
import {Code, Method} from '../../../../chat-application-server/src/utils/Methods'
import { Crypto } from '../../../../chat-application-server/src/modules/crypto/Crypto'

type RequestBody = {
	method: Method
	route: string
	body: any
}

//Mettre en place le Reverse Proxy
class Proxy {

	constructor() {
		
	}

	
	readonly rewrite = (request: NextRequest, response: NextResponse) => {
		try {
			const
				config: any = {
					method: request.method,
	
					// @ts-ignore
					headers: {
						accept: request.headers.get('accept'),
						'content-type': request.headers.get('content-type'),
						'user-agent': 'chat-application/server/proxy',
						['chat-application']: request.headers,
						['authorization']: Crypto.btoa(Crypto.encrypt(`basic ${process.envPROXY_APP_USERNAME}:${PROXY_APP_PASSWORD}`, )),
					},
					credentials: 'include',
					mode: 'cors',
					redirect: 'error',
				}
			if (body.method.toUpperCase() != Method.get) config.body = JSON.stringify(body.body)

			fetch(`${this.host}/${this.solution}/${body.route}`, config)
				.then(_response => {
					_response
						.json()
						.then(data => this.respond(
							response,
							_response.status as Code,
							{ [TERMS.session]: _response.headers.get(Proxy.session) },
							{ data }
						))
					// .catch(reason => this.failure(response, reason)) not required here
				})
				.catch(reason => this.failure(response, reason))
		} catch (error) { 
      console.log(error)
		}
	}


	/**
	 * this method is used to respond to the client
	 * @param {NextApiResponse} response 
	 * @param {Code} statusCode 
	 * @param {DataAny} headers 
	 * @param {any} data 
	 */
	private readonly respond = (response: NextApiResponse, statusCode: Code, headers: DataAny, data: any) => {
		// response.status(statusCode).json(data)
		// response.statusCode = statusCode
		response
			.writeHead(statusCode, { 'content-type': ABCD.json, ...headers })
			.end(JSON.stringify(data))
	}

	/**
	 * this method is used to send an error response to the client
	 * @param {NextApiResponse} response 
	 * @param {any} reason 
	 */
	private readonly failure = (response: NextApiResponse, reason: any) => this.respond(
		response,
		Code.error,
		{},
		{
			data: null,
			[TERMS.error]: Admin.isDevelopment ?
				(reason instanceof Error ? reason.message : reason) :
				true
		}
	)
}

export default new Proxy().rewrite