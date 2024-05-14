/**
*
* 

Ce code définit une classe SecureStore qui gère le stockage sécurisé des données de manière chiffrée à l'aide de l'algorithme de chiffrement AES-256-CBC. La classe utilise le module electron-store pour stocker les données de manière persistante dans l'application Electron. La clé de chiffrement est générée de manière sécurisée lors de l'initialisation de l'instance de SecureStore et est utilisée pour chiffrer et déchiffrer les données stockées.

Les données sont chiffrées avant d'être stockées en utilisant la méthode encryptData, qui génère un vecteur d'initialisation aléatoire (IV) pour chaque chiffrement. Les données sont déchiffrées à l'aide de la méthode decryptData en utilisant la même clé et le même IV utilisés lors du chiffrement.

La classe offre des méthodes simples pour définir, obtenir et vérifier l'existence des données dans le store sécurisé. En interne, elle utilise les fonctionnalités de chiffrement fournies par le module crypto de Node.js pour garantir la sécurité des données stockées.
* @module modules/store/store
 */
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
		return safeStorage.encryptString(Crypto.random(32)).toString('hex')
	}

	private encryptData(data: string): string {
		try {
			const iv = crypto.randomBytes(16);
			const cipher = createCipheriv('aes-256-cbc', this.encryptionKey.subarray(0, 32), iv);
			let encrypted = cipher.update(data, 'utf8', 'hex');
			encrypted += cipher.final('hex');
			return iv.toString('hex') + ':' + encrypted;
		} catch (error) {
			console.log(error)
		}
		
	}

	private decryptData(data: string): string {
		try {
			const parts = data.split(':');
			const iv = Buffer.from(parts.shift(), 'hex');
			const encryptedText = parts.join(':');
			const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey.subarray(0, 32), iv);
			let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
			decrypted += decipher.final('utf8');
			return decrypted;
		} catch (error) {
			console.log(error)
		}
		
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