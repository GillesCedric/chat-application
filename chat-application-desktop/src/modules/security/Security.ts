import { app, safeStorage } from 'electron';
import { createPrivateKey, generateKeyPairSync, privateDecrypt, publicEncrypt } from 'crypto';
import { Crypto } from '../crypto/Crypto';
import Store from 'electron-store'
import path from 'path';

export default class Security {
	private store: Store
	private readonly publicKeyPath: string
	private readonly privateKeyPath: string
	private readonly passphrase: string

	constructor(suffix: number) {
		this.publicKeyPath = 'chat-application-rsa-public-key'
		this.privateKeyPath = 'chat-application-rsa-private-key'
		this.passphrase = 'chat-application-passphrase'
		this.store = new Store({
			//TODO remove the path in production
			cwd: path.join(app.getPath('userData'), `chat-application-${suffix}`),
			name: "security"
		})
		this.init()
	}

	private init() {
		if (!this.store.has(this.passphrase))
			this.store.set(this.passphrase, this.generatePassphrase())

		if (!this.store.has(this.publicKeyPath) || !this.store.has(this.privateKeyPath))
			this.generateKeys()

	}

	private generatePassphrase(): string {
		return safeStorage.encryptString(Crypto.random(16)).toString('hex')
	}

	private getPassphrase() {
		return safeStorage.decryptString(Buffer.from(this.store.get(this.passphrase) as string, 'hex'))
	}

	private generateKeys() {
		const passphrase = this.getPassphrase();
		const { publicKey, privateKey } = generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase }
		});
		this.store.set(this.publicKeyPath, publicKey);
		this.store.set(this.privateKeyPath, privateKey);
	}

	public getKeys() {
		const publicKey = this.store.get(this.publicKeyPath) as string;
		const privateKey = this.store.get(this.privateKeyPath) as string;
		return { publicKey, privateKey };
	}

	private getDecryptedKeys() {

		const { publicKey, privateKey } = this.getKeys()
		try {
			const decryptedPrivateKey = createPrivateKey({
				key: privateKey,
				format: 'pem',
				passphrase: this.getPassphrase()
			});

			return { publicKey, decryptedPrivateKey }
		} catch (error) {
			throw new Error(error)
		}
	}

	public encrypt(message: string, publicKey: string) {
		try {
			const buffer = Buffer.from(message, 'utf8');
			const encryptedMessage = publicEncrypt(publicKey, buffer);
			return encryptedMessage.toString('base64');
		} catch (error) {
			throw new Error(error)
		}
	}

	public decrypt(message: string) {

		const { decryptedPrivateKey } = this.getDecryptedKeys()
		try {
			const buffer = Buffer.from(message, 'base64');
			const decryptedMessage = privateDecrypt({ key: decryptedPrivateKey, passphrase: this.getPassphrase() }, buffer);
			return decryptedMessage.toString('utf8');
		} catch (error) {
			throw new Error(error)
		}
	}

}