import Store from 'electron-store'
import { app, safeStorage } from 'electron';
import crypto, { createCipheriv, createDecipheriv } from 'crypto';
import { Crypto } from '../crypto/Crypto';
import path from 'path';
import fs from 'fs'

export default class SecureStore {
	private encryptionKey: Buffer
	private store: Store
	private instancePath: string

	constructor(suffix: number) {
		//this.createStore()
		this.store = new Store({
			//TODO remove the path in production
			cwd: path.join(app.getPath('userData'), `chat-application-${suffix}`),
			name: "store"
		})
		this.init()
	}

	private init() {
		if (!this.store.has('chat-application-store-secret_key'))
			this.store.set('chat-application-store-secret_key', this.generatePassphrase())

		this.encryptionKey = Buffer.from(safeStorage.decryptString(Buffer.from(this.store.get('chat-application-store-secret_key') as string, 'hex')), 'utf8');
	}

	private generatePassphrase(): string {
		return safeStorage.encryptString(Crypto.random(16)).toString('hex')
	}

	private encryptData(data: string): string {
		const iv = crypto.randomBytes(16);
		const cipher = createCipheriv('aes-256-cbc', this.encryptionKey.subarray(0, 32), iv);
		let encrypted = cipher.update(data, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return iv.toString('hex') + ':' + encrypted;
	}

	private decryptData(data: string): string {
		const parts = data.split(':');
		const iv = Buffer.from(parts.shift(), 'hex');
		const encryptedText = parts.join(':');
		const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey.subarray(0, 32), iv);
		let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}

	private createStore() {
		if (!fs.existsSync(this.instancePath)) {
			fs.mkdirSync(this.instancePath, { recursive: true });
		}
	}

	set(key: string, value: any): void {
		this.store.set(key, this.encryptData(value))
	}

	get(key: string): any {
		return this.decryptData(this.store.get(key) as string)
	}

	has(key: string): boolean {
		return this.store.has(key)
	}
}