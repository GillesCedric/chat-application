/**
*
Ce code définit une classe Crypto qui gère des opérations de chiffrement et de déchiffrement ainsi que la génération de chaînes aléatoires. Il utilise l'algorithme de chiffrement AES-256-CBC. Les méthodes statiques encode et decode encodent et décodent respectivement des chaînes en base64. La méthode statique random génère une chaîne aléatoire de longueur spécifiée en utilisant un ensemble de caractères prédéfinis, comprenant des lettres, des chiffres et des caractères spéciaux.

 * @module modules/Crypto
 */
export class Crypto {

	private readonly encryption_method: string = 'aes-256-cbc'


	private static readonly chars: string[] = 'ABCDEFGHIJKMLNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')


	private static readonly chars2: string[] = [
		...this.chars,
		'!', '§', '%', '&', '(', ')', '=', '?', '{', '[', ']', '}', '@', '€', '*', '+', '#', '>', '<', '|', ';', ','
	]


	protected static readonly randomLength: number = 10

	static readonly encode = (text: string): string => {
		return btoa(text)

	}


	static readonly decode = (text: string): string => {
		return atob(text)
	}

	public static readonly random = (length: number = this.randomLength, specialCharacters: boolean = false): string => {
		let text = ''
		for (let i = 0; i < length; i++) text += specialCharacters ? this.chars2[Math.random() * this.chars.length] : this.chars[Math.floor(Math.random() * this.chars.length)]
		return text
	}

}
