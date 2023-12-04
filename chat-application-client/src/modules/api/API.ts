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

	private static readonly apiUrl: string = process.env.API_URL + '/api'

	public static readonly getAllUsers: () => Promise<any> = async (): Promise<any> => {
		//return await axios.get(this.apiUrl + 'users')
	}

	public static readonly login: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		return fetch(this.apiUrl+'/users', {
			
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