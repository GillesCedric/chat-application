/**
 * Le composant Logout est utilisé pour gérer la déconnexion de l'utilisateur.
 * Il supprime les jetons d'accès et de rafraîchissement stockés dans la mémoire locale,
 * puis redirige l'utilisateur vers la page de connexion.
 * 
 * @module components/Logout
 */
import React from "react"
import { Navigate } from "react-router-dom"

export class Logout extends React.Component {

	/**
	 * @override
	 * @returns {React.ReactNode}
	 */
	render = (): React.ReactNode => {
		//TODO call the sign out route of the backend
		window.electron.store.set('chat-application-access_token', "")
		window.electron.store.set('chat-application-refresh_token', "")
		return <Navigate to="/signin" />

	}
}