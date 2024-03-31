import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	store: {
		get(key: any) {
			return ipcRenderer.sendSync('electron-store-get', key);
		},
		set(property: any, val: any) {
			ipcRenderer.send('electron-store-set', property, val);
		},
		// Other method you want to add like has(), reset(), etc.
	},
	// Any other methods you want to expose in the window object.
	// ...
});