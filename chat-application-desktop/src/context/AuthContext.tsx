import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react"
import API from "../modules/api/API"
import { Navigate } from "react-router-dom"

// Définir le type pour le contexte d'authentification
type AuthUser = {
	access_token: string
} | null | boolean

type AuthContextType = {
	authUser: AuthUser
	setAuthUser: Dispatch<SetStateAction<AuthUser>>
};

// Créer le contexte avec un objet par défaut
export const AuthContext = createContext<AuthContextType>({ authUser: null, setAuthUser: () => { } })

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuthContext = () => {
	return useContext(AuthContext)
};

type AuthContextProviderProps = {
	children: ReactNode
}



// Fournisseur de contexte d'authentification
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {

	const [authUser, setAuthUser] = useState<AuthUser>(JSON.parse('null'))

	const checkAuthentication = async () => {

		const access_token = await window.electron.store.get('chat-application-access_token')
		const refresh_token = await window.electron.store.get('chat-application-refresh_token')

		const response = await API.checkAuthentication({
			access_token,
			refresh_token
		})
		console.log(response)
		if (response && response.message) {
			return access_token
		} else if (response.error && response.error == "Invalid access token") {
			const response2 = await API.refreshTokens({
				access_token,
				refresh_token
			})
			if (response2 && response2.message) {
				window.electron.store.set('chat-application-access_token', response2.access_token)
				window.electron.store.set('chat-application-refresh_token', response2.refresh_token)
				return response2.access_token
			} else {
				return false
			}
		} else {
			return false
		}
	}

	checkAuthentication().then((response) => {
		setAuthUser(response)
	})
		.catch(error => {
		})

	if (authUser == null) {
		return <div>Chargement...</div>
	} else {
		return <AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	}

}
