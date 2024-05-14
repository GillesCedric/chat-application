/**
 * Ce code crée un pont de communication sécurisé entre le processus de rendu d'Electron et le code JavaScript du navigateur en utilisant contextBridge.
 * Il expose deux objets dans le contexte global du navigateur : electron.store pour gérer le stockage de données et electron.security pour les opérations de cryptage et de décryptage.
 * Cela permet d'accéder de manière sécurisée aux fonctionnalités d'Electron depuis le code JavaScript du navigateur.
 * @module preload
 */

import { contextBridge, ipcRenderer } from 'electron';

/**
 * Objet contenant les méthodes pour gérer le stockage de données.
 */
const storeMethods = {
	/**
	 * Récupère la valeur associée à une clé dans le stockage de données.
	 * @param key - La clé à récupérer.
	 * @returns La valeur associée à la clé spécifiée.
	 */
	get(key: any): any {
		return ipcRenderer.sendSync('electron-store-get', key);
	},

	/**
	 * Définit une valeur pour une clé dans le stockage de données.
	 * @param property - La clé pour laquelle définir la valeur.
	 * @param val - La valeur à définir.
	 */
	set(property: any, val: any): void {
		ipcRenderer.send('electron-store-set', property, val);
	},
};

/**
 * Objet contenant les méthodes pour les opérations de cryptage et de décryptage.
 */
const securityMethods = {
	/**
	 * Crypte une chaîne de caractères.
	 * @param val - La chaîne de caractères à crypter.
	 * @returns La chaîne de caractères cryptée.
	 */
	encrypt(val: string): string {
		return ipcRenderer.sendSync('electron-security-encrypt', val);
	},

	/**
	 * Décrypte une chaîne de caractères cryptée.
	 * @param val - La chaîne de caractères cryptée à décrypter.
	 * @returns La chaîne de caractères décryptée.
	 */
	decrypt(val: string): string {
		return ipcRenderer.sendSync('electron-security-decrypt', val);
	},

	/**
	 * Récupère la clé publique utilisée pour le cryptage.
	 * @returns La clé publique.
	 */
	getPublicKey(): string {
		return ipcRenderer.sendSync('electron-security-getPublicKey');
	},
};

/**
 * Expose les méthodes nécessaires dans le contexte global du navigateur.
 */
contextBridge.exposeInMainWorld('electron', {
	store: storeMethods,
	security: securityMethods
	// Ajoutez ici d'autres méthodes que vous souhaitez exposer dans l'objet global du navigateur.
});
