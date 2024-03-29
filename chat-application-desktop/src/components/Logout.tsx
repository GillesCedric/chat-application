import React from "react"
import { Navigate } from "react-router-dom"

export class Logout extends React.Component {

	/**
	 * @override
	 * @returns {React.ReactNode}
	 */
	render = (): React.ReactNode => {
		// if(Cookies.get('user')) Cookies.remove('user')
		return <Navigate to="/authenticate" />
		
	}
}