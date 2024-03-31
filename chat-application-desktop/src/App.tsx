import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './pages/404'
import Home from './pages/home'
import { ProtectedPage } from './components/Protected'
import { Logout } from './components/Logout'

import '../styles/global.css'
import Register from './pages/register'
import Chat from './pages/chat'
import SignIn from './pages/signin'
import ChatPage from './pages/ChatPage'


export default class App extends React.Component<{}, {}> {

	constructor(props: {}) {
		super(props)

	}

	render = (): JSX.Element => {
		//TODO add all the routes of the application
		return <>
			<Routes>
				<Route path='/' element={<Navigate to={'/chat'} />} />
				<Route path='/register' element={<Register />} />
				<Route path='/signin' element={<SignIn />} />
				<Route path='/chatPage' element={<ChatPage />} />
				<Route path='/chat' element={
					<ProtectedPage>
						<Chat />
					</ProtectedPage>
				} />
				<Route path='/logout' element={<Logout />} />
				<Route path='*' element={
					<NotFound />
				} />
			</Routes>
		</>
	}

}