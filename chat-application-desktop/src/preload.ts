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