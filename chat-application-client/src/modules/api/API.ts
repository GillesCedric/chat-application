import axios from "axios"
import Cookies from "../cookies/cookies"
import Crypto from "../../../../library/modules/crypto/crypto"

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
	private static readonly apiUrl: string = 'http://localhost:8000/api/v1/'

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
		return await axios.get(this.apiUrl + 'users')
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
		return await axios.post(this.apiUrl + 'users/login', data)
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
		return await axios.post(this.apiUrl + 'users/register', data)
	}

	/**
	 * @method getAllFroUser
	 * @description this method is used to get all information's about a specific user
	 * @param {number} id the id of the user
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly getAllForUser: (id?: number) => Promise<any> = async (id?: number): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		if (id === undefined) id = userId
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.get(this.apiUrl + 'users/' + userId, {
			headers: {
				authorization: authorization
			}
		})
	}

	/**
	 * @method getAllApplications
	 * @description this method is used to get all application's in API
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly getAllApplications: () => Promise<any> = async (): Promise<any> => {
		return await axios.get(this.apiUrl + 'applications')
	}

	/**
	 * @method addApplication
	 * @description this method is used to get all information's about a specific user
	 * @param {FormData} data the FormData instance witch containing the file
	 * @param {(loaded: number) => void} updater the updater function to update the state
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly addApplication: (data: FormData, updater: (loaded: number) => void) => Promise<any> = async (data: FormData, updater: (loaded: number) => void): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.post(this.apiUrl + 'users/' + userId + "/applications", data, {
			headers: {
				authorization: authorization,
				"Content-Type": "multipart/form-data"
			},
			onUploadProgress: ProgressEvent => {
				updater((ProgressEvent.loaded / ProgressEvent.total*100))
			}
		})
	}

	/**
	 * @method getApplication
	 * @description this method is used to get all the application's about a specific user
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly getApplication: () => Promise<any> = async (): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.get(this.apiUrl + 'users/' + userId + "/applications", {
			headers: {
				authorization: authorization
			}
		})
	}

	/**
	 * @method updateApplication
	 * @description this method is used to update an application
	 * @param {string | number} applicationId the id of the application
	 * @param {string | undefined} name the name of the application
	 * @param {string | undefined} comment the comment of the application
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly updateApplication: (applicationId: string | number, name?: string, comment?: string) => Promise<any> = async (applicationId: string | number, name?: string, comment?: string): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.put(this.apiUrl + 'users/' + userId + "/applications/" + applicationId, { name, comment }, {
			headers: {
				authorization: authorization
			}
		})
	}

	/**
	 * @method deleteApplication
	 * @description this method is used to delete a specific application
	 * @param {string | number} applicationId the id of the user
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly deleteApplication: (applicationId: string | number) => Promise<any> = async (applicationId: string | number): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.delete(this.apiUrl + 'users/' + userId + "/applications/" + applicationId, {
			headers: {
				authorization: authorization
			}
		})
	}

	/**
	 * @method verifyApplication
	 * @description this method is used to verify a specific application
	 * @param {string | number} applicationId the id of the application
	 * @param {string} hash the hash of the application
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly verifyApplication: (applicationId: string | number, hash: string) => Promise<any> = async (applicationId: string | number, hash: string): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.post(this.apiUrl + 'users/' + userId + "/applications/" + applicationId,{hash: hash},
			{
				headers: {
					authorization: authorization
				}
			})
	}

	/**
	 * @method downloadApplication
	 * @description this method is used to download a specific application from the API
	 * @param {string | number} applicationId the id of the application
	 * @public
	 * @static
	 * @readonly
	 * @returns {Promise<any>} the response from the API
	 */
	public static readonly downloadApplication: (applicationId: string | number) => Promise<any> = async (applicationId: string | number): Promise<any> => {
		const { token, userId } = Crypto.decrypt(Cookies.get('user'))
		const authorization = this.tokenPrefix + ' ' + token
		return await axios.get(this.apiUrl + 'users/' + userId + "/applications/" + applicationId, {
			headers: {
				authorization: authorization
			}
		})
	}

}