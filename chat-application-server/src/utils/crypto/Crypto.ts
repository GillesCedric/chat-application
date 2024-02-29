import * as crypto from 'crypto'
import CONFIG from '../../config/config.json'

export type encryptionKeys = 'token' | 'password' | 'database'

export type deterministEncryptionKeys = 'username' | 'tel' | 'email'
/**
 * @class Crypto
 * @author Gilles Cédric
 * @description this class is used for the the encryption and decryption in the application
 * @exports
 * @default
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
		
		if (key == 'username' || key == 'email' || key == 'tel')
			determinist = true

		const encryptionKey = Buffer.from(process.env[`${key.toUpperCase()}_ENCRYPTION_KEY`], 'hex')
		const initializationVector = determinist ? Buffer.from(this.hash.sha256(data.toLowerCase() + CONFIG.appname + process.env[`${key.toUpperCase()}_DETERMINISTE_IV_GENERATION_KEY`]).slice(0, 32), 'hex') : crypto.randomBytes(16)

		if (encryptionKey.length != 32 || initializationVector.length != 16)
			throw new Error("Invalid Key or Iv Size") //TODO: Log the error

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
	public static readonly decrypt: (data: string, key: encryptionKeys) => any = (data: string, key: encryptionKeys): any => {
		const encryptionKey = Buffer.from(process.env[`${key.toUpperCase()}_ENCRYPTION_KEY`], 'hex')

		if (process.env[`${key.toUpperCase()}_ENCRYPTION_KEY`].length != 32)
			throw new Error("Invalid Key Size") //TODO: Log the error
		
		const iv = Buffer.from(data.substring(data.lastIndexOf('.') + 1, data.length), 'base64')
		const buff = Buffer.from(data.substring(0, data.lastIndexOf('.') - 1), 'base64')
		const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv)
		return (
			decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
			decipher.final('utf8')
		)
	}

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
	public static readonly random = (length: number = this.randomLength): string => {
		let text = ''
		for (let i = 0; i < length; i++) text += this.chars2[Math.random() * this.chars.length]
		return text
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
