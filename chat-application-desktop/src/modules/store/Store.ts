import Store from 'electron-store'
import { app } from 'electron';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs'

export default class SecureStore {
	private secretKey: string
	private store: Store
	private instancePath: string

	constructor(secretKey: string) {
		this.secretKey = secretKey
		this.instancePath = path.join(app.getPath('userData'), `chat-application-${crypto.randomInt(100)}`)
		this.createStore()
		this.store = new Store({
			cwd: this.instancePath
		})
	}

	private createStore() {
		if (!fs.existsSync(this.instancePath)) {
			fs.mkdirSync(this.instancePath, { recursive: true });
		}
	}

	set(key: string, value: any): void {
		this.store.set(key, value)
	}

	get(key: string): any {
		return this.store.get(key)
	}
}


export const secureStore = new SecureStore("chat-application-desktop-encryption-generation-key")
