import { Crypto } from "../crypto/Crypto"


export default class API {

	private static readonly tokenPrefix: string = 'Bearer '

	private static readonly apiUrl: string = `http://localhost:4000/api/v1`

	private static readonly headers: HeadersInit = {
		accept: "application/json",
		'content-type': "application/json",
		//'user-agent': 'chat-application/client/proxy',
		//['Access-Control-Allow-Origin']: "http://localhost:3000",
		['authorization']: 'Basic ' + Crypto.btoa(`${process.env.NEXT_PUBLIC_CLIENT_APP_USERNAME}:${process.env.NEXT_PUBLIC_CLIENT_APP_PASSWORD}`),
	}



	public static readonly getAllUsers: () => Promise<any> = async (): Promise<any> => {

	}

	public static readonly login: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		return await fetch(this.apiUrl + '/users/signin', {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify(data)
		})
	}

	public static readonly register: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		let responseData = null
		try {
			const response = await fetch(this.apiUrl + '/users/signup', {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(data)
			})
			responseData = await response.json()
		} catch (error) {
			console.log("error " + error)
		}
		return responseData
	}

}