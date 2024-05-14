/**
*
* 
Ce code définit une classe Security qui gère la sécurité des données dans l'application Electron. Elle utilise des fonctionnalités de chiffrement et de déchiffrement fournies par le module crypto de Node.js pour générer et gérer des clés RSA et pour chiffrer et déchiffrer des messages. La classe utilise également le module electron-store pour stocker de manière sécurisée les clés et les informations sensibles telles que la passphrase utilisée pour protéger la clé privée.

La méthode init initialise la classe en générant une passphrase si elle n'existe pas déjà, et en générant une paire de clés RSA si elles n'existent pas déjà dans le stockage sécurisé.

Les méthodes getKeys et getDecryptedKeys récupèrent respectivement les clés publiques et privées, avec la clé privée déchiffrée à l'aide de la passphrase.

Les méthodes encrypt et decrypt sont utilisées pour chiffrer et déchiffrer des messages à l'aide des clés publiques et privées respectivement.

Dans l'ensemble, cette classe offre une couche de sécurité pour les données sensibles de l'application Electron, en utilisant des techniques de chiffrement robustes pour protéger les informations confidentielles.
 * @module modules/security/Security
 */
import { app, safeStorage } from 'electron';
import { createCipheriv, createDecipheriv, createPrivateKey, generateKeyPairSync, privateDecrypt, publicEncrypt, randomBytes, constants } from 'crypto';
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
			console.log(error)
		}
	}

	public encryptWithPublicKey(message: string, publicKey: string) {
		try {
			const buffer = Buffer.from(message, 'utf8');
			const encryptedMessage = publicEncrypt(publicKey, buffer);
			return encryptedMessage.toString('base64');
		} catch (error) {
			console.log(error)
		}
	}

	public decryptWithPrivateKey(message: string) {
		const { decryptedPrivateKey } = this.getDecryptedKeys()
		try {
			const buffer = Buffer.from(message, 'base64');
			const decrypted = privateDecrypt(
				{
					key: decryptedPrivateKey,
					padding: constants.RSA_PKCS1_OAEP_PADDING,
					oaepHash: "sha256",
				},
				buffer
			).toString('hex')
			console.log(decrypted)
			return decrypted
		} catch (error) {
			console.log(error)
		}
	}

	public encryptWithSymmetricKey(message: string, symmetricKey: string) {
		try {
			const iv = randomBytes(16); // Initialisation Vector
			const cipher = createCipheriv('aes-256-cbc', Buffer.from(symmetricKey, 'hex'), iv);
			let encrypted = cipher.update(message, 'utf8', 'hex');
			encrypted += cipher.final('hex');
			return iv.toString('hex') + ':' + encrypted;
		} catch (error) {
			console.log(error)
		}
		
	}

	public decryptWithSymmetricKey(encryptedMessage: string, symmetricKey: string) {
		try {
			const [iv, encrypted] = encryptedMessage.split(':');
			const decipher = createDecipheriv('aes-256-cbc', Buffer.from(symmetricKey, 'hex'), Buffer.from(iv, 'hex'));
			let decrypted = decipher.update(encrypted, 'hex', 'utf8');
			decrypted += decipher.final('utf8');
			return decrypted;
		} catch (error) {
			console.log(error)
		}
	
}


}