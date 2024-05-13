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
		encryptWithPublicKey(val: string, key: string): string {
			return ipcRenderer.sendSync('electron-security-encryptWithPublicKey', val, key);
		},
		decryptWithPrivateKey(val: string): string {
			return ipcRenderer.sendSync('electron-security-decryptWithPrivateKey', val);
		},
		encryptWithSymmetricKey(val: string, key: string): string {
			return ipcRenderer.sendSync('electron-security-encryptWithSymmetricKey', val, key);
		},
		decryptWithSymmetricKey(val: string, key: string): string {
			return ipcRenderer.sendSync('electron-security-decryptWithSymmetricKey', val, key);
		},
		getPublicKey(): string {
			return ipcRenderer.sendSync('electron-security-getPublicKey');
		},
	},
	// Any other methods you want to expose in the window object.
	// ...
});