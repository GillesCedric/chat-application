/**
 * Module contenant des utilitaires et des définitions liés aux communications réseau dans l'application.
 * @module utils/networkUtils
 */

/**
 * Enumération des mots-clés de socket.
 * @readonly
 * @enum {string}
 */
export enum SocketKeywords {
	join = "join",
	connection = "connection",
	disconnect = "disconnect",
	newNotification = "new-notification",
	newConversation = "new-conversation",
	newMessage = "new-message",
	emit = "emit",
}

/**
 * Enumération des services disponibles dans l'application.
 * @readonly
 * @enum {string}
 */
export enum Services {
	user = "user",
	chat = "chat",
	notification = "notification",
	apigw = "api-gateway",
	socket = "socket",
}

/**
 * Enumération des types de jetons (tokens).
 * @readonly
 * @enum {string}
 */
export enum Tokens {
	accessToken = "access_token",
	refreshToken = "refresh_token",
}
