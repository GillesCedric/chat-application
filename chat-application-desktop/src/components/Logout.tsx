import React from "react"
import { Navigate } from "react-router-dom"

export class Logout extends React.Component {

	/**
	 * @override
	 * @returns {React.ReactNode}
	 */
	render = (): React.ReactNode => {
		window.electron.store.set('chat-application-access_token', "")
		window.electron.store.set('chat-application-refresh_token', "")
		return <Navigate to="/signin" />
		
	}
}