import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AuthContextProvider } from './context/AuthContext'
const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
)

root.render(
	<React.StrictMode>
		<HashRouter>
			<AuthContextProvider>
				<App />
			</AuthContextProvider>
		</HashRouter>
	</React.StrictMode>
)
