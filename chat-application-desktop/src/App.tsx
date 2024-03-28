import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './pages/404'
import Home from './pages/home'
import { ProtectedPage } from './components/Protected'
import { Logout } from './components/Logout'

import '../styles/global.css'
import Register from './pages/register'
import Chat from './pages/chat'


export default class App extends React.Component<{}, {}> {

	constructor(props: {}) {
		super(props)

	}

	render = (): JSX.Element => {
		return <>
			<Routes>
				<Route path='/' element={<Navigate to={'/home'} />} />
				<Route path='/register' element={<Register />} />
				<Route path='/home' element={
					// <ProtectedPage> //TODO enable the protection when the signin will be finished
					<Home />

					// </ProtectedPage> //TODO add all the routes of the application
				} />
				<Route path='/chat' element={
					// <ProtectedPage>
					<Chat />

					// </ProtectedPage>
				} />
				<Route path='/logout' element={<Logout />} />
				<Route path='*' element={
					<NotFound />
				} />
			</Routes>
		</>
	}

}