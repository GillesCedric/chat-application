import CONFIG from '../../config/config.json'
import MulterExpress, { FileFilterCallback } from 'multer'
import { Request } from 'express';

/**
 * @class Crypto
 * @author Gilles Cédric
 * @description this class is used for the the encryption and decryption in the application
 * @exports
 * @default
 * @since 23/05/2022
 */
export default class Multer {

	private static fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback,) => {
		// Accepter uniquement les fichiers images
		if (file.mimetype.startsWith('image/')) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	};


	public static readonly upload = MulterExpress({
		dest: 'data/users/', // Répertoire de destination
		fileFilter: this.fileFilter,
		limits: {
			fileSize: 1024 * 1024 * 2 // Limiter la taille du fichier à 2MB
		}
	})

}
