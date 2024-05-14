/**
 * @module components/Logout
 * 
 * Le composant Logout est utilisé pour gérer la déconnexion de l'utilisateur.
 * Il supprime les jetons d'accès et de rafraîchissement stockés dans la mémoire locale,
 * puis redirige l'utilisateur vers la page de connexion.
 */

import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Composant Logout.
 * 
 * Ce composant gère la déconnexion de l'utilisateur. Lorsqu'il est rendu,
 * il supprime les jetons d'accès et de rafraîchissement stockés dans la mémoire locale,
 * puis redirige l'utilisateur vers la page de connexion.
 * 
 * @class
 * @extends React.Component
 */
export class Logout extends React.Component {
	/**
	 * Redirige l'utilisateur vers la page de connexion après avoir supprimé les jetons.
	 * 
	 * @returns {React.ReactNode} - Redirige vers la page de connexion.
	 */
	render = (): React.ReactNode => {
		// Suppression des jetons d'accès et de rafraîchissement de la mémoire locale.
		window.electron.store.set('chat-application-access_token', "");
		window.electron.store.set('chat-application-refresh_token', "");

		// Redirection vers la page de connexion.
		return <Navigate to="/signin" />;
	}
}
