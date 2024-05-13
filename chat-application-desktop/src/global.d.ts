export {}

declare global {
	interface Window {
		electron: {
			store: {
				get: (key: string) => any;
				set: (key: string, val: any) => void;
			},
			security: {
				encryptWithPublicKey: (val: string, publicKey: string) => string;
				decryptWithPrivateKey: (val: string) => string;
				encryptWithSymmetricKey: (val: string, key: string) => string;
				decryptWithSymmetricKey: (val: string, key: string) => string;
				getPublicKey: () => string;
			},
		}
	}
}