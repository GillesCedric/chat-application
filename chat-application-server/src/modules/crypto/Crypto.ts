import * as crypto from 'crypto'
import CONFIG from '../../config/config.json'

/**
 * @typedef encryptionKeys
 * @description 
 */
export type encryptionKeys = 'token' | 'password' | 'database' | 'data'

export type deterministEncryptionKeys = 'username' | 'tel' | 'email' | 'status' | 'boolean'

/**
 * @class Crypto
 * @author Gilles Cédric
 * @description this class is used for the the encryption and decryption in the application
 * @exports
 * @since 23/05/2022
 */
export class Crypto {

	private readonly encryption_method: string = 'aes-256-cbc'


	/**
	 * @property chars
	 * @description all the chars characters that should be used for encryption and decryption
	 * @private
	 * @static
	 * @readonly
	 * @type {string[]}
	 */
	private static readonly chars: string[] = 'ABCDEFGHIJKMLNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')

	/**
	 * @property secret_key
	 * @description the additional characters for encryption and decryption
	 * @private
	 * @static
	 * @readonly
	 * @type {string[]}
	 */
	private static readonly chars2: string[] = [
		...this.chars,
		'!', '§', '%', '&', '(', ')', '=', '?', '{', '[', ']', '}', '@', '€', '*', '+', '#', '>', '<', '|', ';', ','
	]

	/**
	 * @property secret_key
	 * @description the length for the random string generator
	 * @private
	 * @static
	 * @readonly
	 * @type {number}
	 */
	protected static readonly randomLength: number = 10

	/**
	 * @property secret_key
	 * @description all the encryption and description method
	 * @private
	 * @static
	 * @readonly
	 */
	public static readonly hash = {

		/**
		 * @function md5
		 * @static
		 * @description this __OBJECT__ is used to create a **MD5** string from the given message
		 * @param {string} message s.e.
		 * @returns {string} the base64 encoded MD5 hash
		 */
		md5: (message: any): string => crypto.createHash('md5').update(JSON.stringify(message)).digest('hex'),

		/**
		 * @function sha256
		 * @static
		 * @description this __OBJECT__ is used to create a **SHA256** string from the given message
		 * @param {string} message s.e.
		 * @returns {string} the base64 encoded SHA256 hash
		 */
		sha256: (message: any): string => crypto.createHash('sha256').update(JSON.stringify(message)).digest('hex'),

		/**
		 * @function sha512
		 * @static
		 * @description this __OBJECT__ is used to create a **sha512** string from the given message
		 * @param {string} message s.e.
		 * @returns {string} the base64 encoded sha512 hash
		 */
		sha512: (message: any): string => crypto.createHash('sha512').update(JSON.stringify(message)).digest('hex'),
	}

	/**
	 * @function encrypt
	 * @static
	 * @description this __OBJECT__ is used to create a **AES** string from the given message
	 * @param {string} message s.e.
	 * @returns {string} the encoded AES hash
	 */
	public static readonly encrypt = (data: string, key: encryptionKeys | deterministEncryptionKeys): string => {

		let determinist = false

		if (key == 'username' || 'email' || 'tel') determinist = true

		const encryptionKey = Buffer.from(process.env[`${key.toUpperCase()}_ENCRYPTION_KEY`], 'hex')
		const initializationVector = determinist ? Buffer.from(this.hash.sha256(data.toLowerCase() + CONFIG.appname + process.env[`${key.toUpperCase()}_DETERMINISTE_IV_GENERATION_KEY`]).slice(0, 32), 'hex') : crypto.randomBytes(16)

		if (encryptionKey.length != 32 || initializationVector.length != 16)
			throw new Error("Invalid Key or Iv Size")

		const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, initializationVector)
		return Buffer.from(
			cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
		).toString('base64') + '.' + initializationVector.toString('base64')
	}

	/**
	* @function decrypt
	* @static
	* @description this __OBJECT__ is used to create a decrypted string from the given **AES** message
	* @param {string} message s.e.
	* @returns {string} the decoded string
	*/
	public static readonly decrypt: (data: string, key: encryptionKeys | deterministEncryptionKeys) => any = (data: string, key: encryptionKeys | deterministEncryptionKeys): any => {
		const encryptionKey = Buffer.from(process.env[`${key.toUpperCase()}_ENCRYPTION_KEY`], 'hex')

		if (encryptionKey.length != 32)
			throw new Error("Invalid Key Size")

		const iv = Buffer.from(data.substring(data.lastIndexOf('.') + 1, data.length), 'base64')
		const buff = Buffer.from(data.substring(0, data.lastIndexOf('.') - 1), 'base64')
		const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv)
		return (
			decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
			decipher.final('utf8')
		)
	}

	public static readonly encryptWithPublicKey = (message: string, publicKey: string) => {
		try {
			const buffer = Buffer.from(message, 'utf8');
			const encryptedMessage = crypto.publicEncrypt(publicKey.replace(/\\n/g, '\n'), buffer);
			return encryptedMessage.toString('base64');
		} catch (error) {
			throw new Error(error)
		}
	}

	private static readonly formatPublicKey = (key: string) => {
		// Supprimer tous les sauts de ligne existants
		let cleanKey = key.replace('\n', '');

		// Extraire l'en-tête et le pied de page
		const header = "-----BEGIN PUBLIC KEY-----";
		const footer = "-----END PUBLIC KEY-----";

		// Supprimer l'en-tête et le pied de page pour travailler uniquement sur la base64
		cleanKey = cleanKey.replace(header, '').replace(footer, '');

		// Ajouter un saut de ligne tous les 64 caractères
		//const formattedKey = cleanKey.match(/.{1,64}/g).join('\n');

		// Reconstruire la clé complète avec en-tête et pied de page
		return `${header}${cleanKey}${footer}`;
	}

	public static readonly encryptSymmetricKey = (symmetricKey: Buffer, publicKey: string) => {
		console.log(publicKey)

		return crypto.publicEncrypt(
			{
				key: publicKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256",
			},
			symmetricKey
		).toString('base64')
	}

	public static readonly generateSymmetricKey = () => crypto.randomBytes(32)

	/**
	 * @function encode
	 * @description encode: binary to base64 ASCII
	 * @see https://stackoverflow.com/a/51500400/2652918 the inspiration came from here
	 * @see https://dirask.com/posts/Node-js-atob-btoa-functions-equivalents-1Aqb51
	 * @param {string} text the binary text
	 * @returns {string} the (encoded) ASCII text
	 */
	static readonly encode = (text: string): string => Buffer
		.from(text, 'binary')
		.toString('base64')
	static readonly btoa = this.encode //preserved for backwards compatibility

	/**
	 * @function decode
	 * @description decode: base64 ASCII to binary
	 * @see https://dirask.com/posts/Node-js-atob-btoa-functions-equivalents-1Aqb51
	 * @see https://attacomsian.com/blog/javascript-base64-encode-decode encoding special characters
	 * @param {string} text the Base64-encoded ASCII text
	 * @returns {string} the (decoded) binary text
	 */
	static readonly decode = (text: string): string => Buffer
		.from(text, 'base64')
		.toString('binary')
	static readonly atob = this.decode //preserved for backwards compatibility


	/**
	 * @function random
	 * @description this __OBJECT__ is used to generate a pseudo random word
	 * @param {number} length {10} the length of the word
	 * @returns {string} s.e.
	 */
	public static readonly random = (length: number = this.randomLength, specialCharacters: boolean = false): string => {
		let text = ''
		for (let i = 0; i < length; i++) text += specialCharacters ? this.chars2[Math.random() * this.chars.length] : this.chars[Math.floor(Math.random() * this.chars.length)]
		return text
	}

	/**
	 * @function randomInt
	 * @description this __OBJECT__ is used to generate a pseudo random int word
	 * @param {number} length {10} the length of the word
	 * @returns {string} s.e.
	 */
	public static readonly randomInt = (length: number = this.randomLength, min: number = 1, max: number = 9): string => {
		let text = ''
		for (let i = 0; i < length; i++) text += Math.floor(Math.random() * (max - min + 1)) + min
		return text
	}

	/**
	 * @function randomBytes
	 * @description this __OBJECT__ is used to generate a pseudo random int word
	 * @param {number} length {10} the length of the word
	 * @returns {string} s.e.
	 */
	public static readonly randomBytes = (length: number = this.randomLength, encoding: BufferEncoding = 'hex'): string => {
		return crypto.randomBytes(length).toString(encoding)
	}

	/**
	 * @function identifier
	 * @description this __OBJECT__ is used to generate a random unique identifier
	 * @param {string} suffix {''} s.e.
	 * @param {number} length {10} the length of the word
	 * @returns {string} the random identifier
	 */
	public static readonly identifier = (suffix: string | number = '', length: number = this.randomLength): string => Date.now() + this.random(length) + suffix

}

