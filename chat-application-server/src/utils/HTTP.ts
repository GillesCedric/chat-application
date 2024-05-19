/**
 * Module contenant des utilitaires liés aux requêtes HTTPS.
 * @module utils/httpsUtils
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { Services } from './Keywords';
import { Crypto } from '../modules/crypto/Crypto';

/**
 * Enumération des méthodes HTTP.
 * @readonly
 * @enum {string}
 */
export enum Method {
	options = 'OPTIONS',
	head = 'HEAD',
	get = 'GET',
	post = 'POST',
	put = 'PUT',
	patch = 'PATCH',
	delete = 'DELETE',
}

/**
 * Enumération des codes de statut HTTP.
 * @readonly
 * @enum {number}
 */
export enum Code {
	okay = 200,
	created = 201,
	updated = 202,
	deleted = 204,
	unauthorized = 401, // Pour le jeton (Token)
	notFound = 404,
	serviceUnavailable = 503,
	forbidden = 403, // Pour l'authentification de base (Basic Authentication)
	internalError = 500,
	badRequest = 422,
}

/**
 * Fonction qui retourne le protocole à utiliser en fonction de l'environnement.
 * @returns {string} Le protocole à utiliser (http ou https).
 */
export const protocol = () => process.env.NODE_ENV === "development" ? "http" : "https";

/**
 * Fonction qui retourne un agent HTTPS pour une utilisation dans les requêtes HTTPS.
 * @param {Services} service - Le service pour lequel on souhaite créer l'agent HTTPS.
 * @returns {https.Agent} L'agent HTTPS configuré.
 */
export const httpsAgent = (service: Services) => new https.Agent({
	requestCert: true,
	rejectUnauthorized: true,
	key: fs.readFileSync(path.join(process.cwd(), 'certs', service, `${service}-key.pem`)),
	cert: fs.readFileSync(path.join(process.cwd(), 'certs', service, `${service}-cert.pem`)),
	ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'ca', 'ca-cert.pem')),
});

/**
 * Fonction qui retourne les en-têtes HTTP communs pour les requêtes.
 * @param {string} userAgent - L'agent utilisateur à inclure dans les en-têtes.
 * @returns {HeadersInit} Les en-têtes HTTP communs.
 */
export const headers: (userAgent: string) => HeadersInit = (userAgent: string) => {
	return {
		accept: "application/json",
		"content-type": "application/json; charset=utf-8",
		["authorization"]: "Basic " + Crypto.encode(`${process.env.BASIC_APP_USERNAME}:${process.env.BASIC_APP_PASSWORD}`),
		credentials: 'include',
		"user-agent": userAgent
	};
};
