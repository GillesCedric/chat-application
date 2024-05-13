export {}

declare global {
	interface Window {
		electron: {
			store: {
				get: (key: string) => any;
				set: (key: string, val: any) => void;
			},
			security: {
				encrypt: (val: string, publicKey: string) => string;
				decrypt: (val: string) => string;
				getPublicKey: () => string;
			},
		}
	}
}