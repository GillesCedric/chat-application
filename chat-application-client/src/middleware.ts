import { NextResponse, NextRequest } from 'next/server'
import { Code, Method } from '../../chat-application-server/src/utils/Methods'
import { Crypto } from '../../chat-application-server/src/modules/crypto/Crypto'

//Mettre en place le Reverse Proxy
export async function middleware(request: NextRequest) {
	if (!request.nextUrl.pathname.startsWith('/api')) {
		NextResponse.next()
	} else {

		const authorization = request.headers.get('authorization')
		if (!authorization || authorization.indexOf('Basic ') == -1)
			return NextResponse.json({ message: 'Incorrect Client Authorization Header' });

		const credentials = Crypto.atob(authorization.split(' ')[1]).split(':')
		if (credentials[0] != process.env.CLIENT_APP_USERNAME || credentials[1] != process.env.CLIENT_APP_PASSWORD)
			return NextResponse.json({ message: 'Missing Client Authorization Header' });

		try {
			const
				config: any = {
					method: request.method,

					// @ts-ignore
					headers: {
						accept: request.headers.get('accept'),
						'content-type': request.headers.get('content-type'),
						'user-agent': 'chat-application/server/proxy',
						['chat-application-session']: request.headers.get('session'),
						['authorization']: 'Basic ' + Crypto.btoa(`${process.env.REVERSE_APP_USERNAME}:${process.env.REVERSE_APP_PASSWORD}`),
					},
					credentials: 'include',
					mode: 'cors',
					redirect: 'error',
				}
			if (request.method.toUpperCase() != Method.get) config.body = JSON.stringify(request.body)


			const response = fetch(`${process.env.BACK_URL}:${process.env.BACK_PORT}${request.nextUrl.pathname}`, config)

			const data = await (await response).json()
			return NextResponse.json(data)
		} catch (error) {
			return NextResponse.json({ error })
		}
	}

}