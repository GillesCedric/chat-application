/**
 * Ce code définit une classe Crypto qui gère des opérations de chiffrement et de déchiffrement ainsi que la génération de chaînes aléatoires. Il utilise l'algorithme de chiffrement AES-256-CBC. Les méthodes statiques encode et decode encodent et décodent respectivement des chaînes en base64. La méthode statique random génère une chaîne aléatoire de longueur spécifiée en utilisant un ensemble de caractères prédéfinis, comprenant des lettres, des chiffres et des caractères spéciaux.
 * @module modules/Crypto
 */
export class Crypto {

	// Méthode de chiffrement utilisée
	private readonly encryption_method: string = 'aes-256-cbc';

	// Ensemble de caractères pour l'encodage et le décodage
	private static readonly chars: string[] = 'ABCDEFGHIJKMLNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('');

	// Ensemble de caractères étendu pour la génération de chaînes aléatoires
	private static readonly chars2: string[] = [
		...this.chars,
		'!', '§', '%', '&', '(', ')', '=', '?', '{', '[', ']', '}', '@', '€', '*', '+', '#', '>', '<', '|', ';', ','
	];

	// Longueur par défaut des chaînes aléatoires
	protected static readonly randomLength: number = 10;

	/**
	 * Encode une chaîne en base64.
	 * @param text La chaîne à encoder.
	 * @returns La chaîne encodée en base64.
	 */
	static readonly encode = (text: string): string => {
		return btoa(text);
	}

	/**
	 * Décode une chaîne encodée en base64.
	 * @param text La chaîne encodée en base64.
	 * @returns La chaîne décodée.
	 */
	static readonly decode = (text: string): string => {
		return atob(text);
	}

	/**
	 * Génère une chaîne aléatoire.
	 * @param length La longueur de la chaîne aléatoire à générer.
	 * @returns Une chaîne aléatoire de la longueur spécifiée.
	 */
	public static readonly random = (length: number = this.randomLength): string => {
		let text = '';
		for (let i = 0; i < length; i++)
			text += this.chars2[Math.floor(Math.random() * this.chars2.length)];
		return text;
	}
}
