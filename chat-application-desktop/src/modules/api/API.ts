import { Crypto } from "../crypto/Crypto"
import CONFIG from "../../config/config.json"
import { Tokens } from "../..//utils/Tokens"
import { redirect } from "react-router-dom"


export default class API {

	private static readonly tokenPrefix: string = 'Bearer '

	private static readonly apiUrl: string = `${CONFIG.api_url}/${CONFIG.api_basepath}/v${CONFIG.api_version}`

	private static readonly headers: HeadersInit = {
		accept: "application/json",
		'content-type': "application/json",
		//'user-agent': 'chat-application/client/proxy',
		//['Access-Control-Allow-Origin']: "http://localhost:3000",
		['authorization']: 'Basic ' + Crypto.encode(`${CONFIG.basic_username}:${CONFIG.basic_password}`),
		credentials: 'include'
	}

	private static readonly generateBody = async (data: any) => {
		const access_token = await window.electron.store.get('chat-application-access_token')
		const refresh_token = await window.electron.store.get('chat-application-refresh_token')

		return JSON.stringify({
			...data,
			access_token,
			refresh_token
		})
	}

	private static handleRequest = async (responseData: any) => {
		if (responseData.message && responseData.access_token && responseData.refresh_token){
			window.electron.store.set('chat-application-access_token', responseData.access_token)
			window.electron.store.set('chat-application-refresh_token', responseData.refresh_token)
			return false
		}else if (responseData.error && responseData.error == "unauthenticated") {
			const access_token = await window.electron.store.get('chat-application-access_token')
			const refresh_token = await window.electron.store.get('chat-application-refresh_token')
			const response = await this.refreshTokens({
				access_token,
				refresh_token
			})
			if (response.message) {
				window.electron.store.set('chat-application-access_token', response.access_token)
				window.electron.store.set('chat-application-refresh_token', response.refresh_token)
			} else {
				redirect('/signin')
			}
			return true
		}
		return false
	}

	public static readonly refreshTokens: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		let responseData = null
		try {
			const response = await fetch(this.apiUrl + '/users/token', {
				method: 'PUT',
				headers: this.headers,
				body: data
			})
			responseData = await response.json()
		} catch (error) {
			console.log("error " + error)
		}
		return responseData
	}

	public static readonly checkAuthentication: (data: any) => Promise<any> = async (data: any): Promise<any> => {
		let responseData = null
		try {
			const response = await fetch(this.apiUrl + '/users/token', {
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



	public static readonly getAllUsers: () => Promise<any> = async (): Promise<any> => {

	}

	public static readonly login: (data: any) => Promise<any> = async (data: any): Promise<any> => {


		let responseData = null
		let handleRequest = false
		try {
			const response = await fetch(this.apiUrl + '/users/signin', {
				method: 'POST',
				headers: {
					...this.headers,
				},
				body: await this.generateBody(data)
			})
			responseData = await response.json()
		} catch (error) {
			console.log("error " + error)
		}
		handleRequest = await this.handleRequest(responseData)
		if (handleRequest)
			return this.login(data)
		return responseData
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