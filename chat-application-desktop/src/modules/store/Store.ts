import Store from 'electron-store'

export default class SecureStore {
	private secretKey: string
	private store: Store

	constructor(secretKey: string) {
		this.secretKey = secretKey
		this.store = new Store()
	}

	set(key: string, value: any): void {
		this.store.set(key, value)
	}

	get(key: string): any {
		return this.store.get(key)
	}
}


export const secureStore = new SecureStore("chat-application-desktop-encryption-generation-key")
