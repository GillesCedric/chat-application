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

	/**
	 * @property apiUrl
	 * @description the url of the API
	 * @private
	 * @static
	 * @readonly
	 * @type {string}
	 */
	private static readonly tokenPrefix: string = 'Bearer'

	/**
	 * @method getAllUsers
	 * @description this method is used to get all the users from the API
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly getAllUsers: () => Promise<any> = async (): Promise<any> => {
		//return await axios.get(this.apiUrl + 'users')
	}

	/**
	 * @method login
	 * @description this method is used to login the application
	 * @param {any} data the login credentials to send to the API
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly login: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		//return await axios.post(this.apiUrl + 'users/login', data)
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