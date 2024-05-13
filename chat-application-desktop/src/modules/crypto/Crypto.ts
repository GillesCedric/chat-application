
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
