/**
Ce code crée un pont de communication sécurisé entre le processus de rendu d'Electron et le code JavaScript du navigateur en utilisant contextBridge. Il expose deux objets dans le contexte global du navigateur : electron.store pour gérer le stockage de données et electron.security pour les opérations de cryptage et de décryptage. Cela permet d'accéder de manière sécurisée aux fonctionnalités d'Electron depuis le code JavaScript du navigateur.
* @module preload
 */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	store: {
		get(key: any) {
			return ipcRenderer.sendSync('electron-store-get', key);
		},
		set(property: any, val: any) {
			ipcRenderer.send('electron-store-set', property, val);
		},
	},
	security: {
		encrypt(val: string): string {
			return ipcRenderer.sendSync('electron-security-encrypt', val);
		},
		decrypt(val: string): string {
			return ipcRenderer.sendSync('electron-security-decrypt', val);
		},
		getPublicKey(): string {
			return ipcRenderer.sendSync('electron-security-getPublicKey');
		},
	},
	// Any other methods you want to expose in the window object.
	// ...
});