import React from "react"
import { Navigate } from "react-router-dom"

export class ProtectedPage extends React.Component<{children?: React.ReactNode}> {

	/**
	 * @override
	 * @returns {React.ReactNode}
	 */
	render = (): React.ReactNode => {
		// if (Cookies.get('user')) {
		// 	return this.props.children
		// }
		return <Navigate to="/authenticate" />
		
	}
}