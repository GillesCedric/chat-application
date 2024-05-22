/**
 * Classe Multer pour la gestion des téléversements de fichiers.
 * @module modules/multer/Multer
 */

import MulterExpress, { FileFilterCallback } from 'multer';
import { Request } from 'express';

/**
 * Middleware pour la gestion des téléversements de fichiers.
 * Cette classe fournit une méthode statique pour configurer Multer afin de gérer les téléversements de fichiers dans l'application.
 */
export default class Multer {

	/**
	 * Fonction de filtrage des fichiers.
	 * Cette fonction est utilisée pour filtrer les types de fichiers acceptés lors du téléversement.
	 *
	 * @param {Request} req - L'objet requête Express.
	 * @param {Express.Multer.File} file - L'objet fichier Multer.
	 * @param {FileFilterCallback} callback - Fonction de rappel pour indiquer si le fichier est accepté ou non.
	 * @returns {void} Rien.
	 */
	private static fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
		// Accepter uniquement les fichiers images
		if (file.mimetype.startsWith('image/')) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	};

	/**
	 * Middleware pour gérer les téléversements de fichiers.
	 * Cette méthode configure Multer pour gérer les téléversements de fichiers dans l'application.
	 * Elle définit également des limites de taille de fichier et un répertoire de destination.
	 *
	 * @type {MulterExpress}
	 * @example
	 * // Utilisation dans une route Express
	 * import express from 'express';
	 * import Multer from './middlewares/Multer';
	 *
	 * const app = express();
	 *
	 * app.post('/upload', Multer.upload.single('file'), (req, res) => {
	 *   res.send('Fichier téléversé avec succès');
	 * });
	 */
	public static readonly upload = MulterExpress({
		dest: 'data/users/', // Répertoire de destination
		fileFilter: this.fileFilter,
		limits: {
			fileSize: 1024 * 1024 * 2 // Limiter la taille du fichier à 2MB
		}
	});
}
