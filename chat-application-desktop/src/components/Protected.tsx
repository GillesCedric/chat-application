import React from "react"
import { Navigate } from "react-router-dom"
import API from "../modules/api/API"
import { Tokens } from "../utils/Tokens"

interface ProtectedPageState {
	isAuthenticated: boolean | null
}

export class ProtectedPage extends React.Component<{ children?: React.ReactNode }, ProtectedPageState> {
	state: ProtectedPageState = {
		isAuthenticated: null,
	};

	componentDidMount() {
		this.checkAuthentication()
	}

	private readonly checkAuthentication = async () => {

		const access_token = await window.electron.store.get('chat-application-access_token')
		const refresh_token = await window.electron.store.get('chat-application-refresh_token')

		console.log(access_token)
		console.log(refresh_token)

		const response = await API.checkAuthentication({
			access_token,
			refresh_token
		})
		console.log(response)
		if (response.message) {
			this.setState({ isAuthenticated: true })
		} else if (response.error && response.error == "Invalid access token") {
			const response = await API.refreshTokens({
				access_token,
				refresh_token
			})
			if (response.message) {
				window.electron.store.set('chat-application-access_token', response.access_token)
				window.electron.store.set('chat-application-refresh_token', response.refresh_token)
				this.setState({ isAuthenticated: true })
			} else {
				this.setState({ isAuthenticated: false })
			}
		} else {
			this.setState({ isAuthenticated: false })
		}
	}

	render(): React.ReactNode {
		const { isAuthenticated } = this.state

		// En attente de la vérification
		if (isAuthenticated === null) {
			return <div>Chargement...</div> //TODO render loading component
		}

		// Redirection si non authentifié
		if (!isAuthenticated) {
			return <Navigate to="/signin" replace />
		}

		// Afficher le contenu protégé si authentifié
		return this.props.children
	}
}
