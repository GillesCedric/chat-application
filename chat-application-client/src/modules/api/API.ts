import Cookies from "../cookies/Cookies"
import { Crypto } from "../../../../chat-application-server/src/modules/crypto/Crypto"

/**
 * @class API
 * @author Gilles Cédric
 * @description this class is used to manage the request and the response with the API
 * @exports
 * @default
 * @since 21/05/2022
 */
export default class API {

	private static readonly tokenPrefix: string = 'Bearer '

	private static readonly basicTokenPrefix: string = 'Basic '

	private static readonly apiUrl: string = `${process.env.REVERSE_URL}:${process.env.REVERSE_PORT}/api`

	private static readonly headers: HeadersInit = {
			accept: "application/json",
			'content-type': "application/json",
			'user-agent': 'chat-application/client/proxy',
			['chat-application-session']: Crypto.random(16),
			['authorization']: 'Basic ' + Crypto.btoa(`${process.env.CLIENT_APP_USERNAME}:${process.env.CLIENT_APP_PASSWORD}`),
		}
		
	

	public static readonly getAllUsers: () => Promise<any> = async (): Promise<any> => {
		//return await axios.get(this.apiUrl + 'users')
	}

	public static readonly login: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		return await fetch(this.apiUrl+'/users/login', {
			method: 'POST',
			headers: this.headers
		})
	}

	/**
	 * @method register
	 * @description this method is used to register in the application
	 * @param {any} data the registers data to send to the API
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly register: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		//return await axios.post(this.apiUrl + 'users/register', data)
	}

}