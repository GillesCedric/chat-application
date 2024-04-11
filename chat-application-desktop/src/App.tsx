import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './pages/404'
import Home from './pages/home'
import { Logout } from './components/Logout'

import '../styles/global.css'
import Register from './pages/register'
import Chat from './pages/chat'
import SignIn from './pages/signin'
import { useAuthContext } from './context/AuthContext'
import ChatPage from './pages/ChatPage'


export default function App() {
	const {authUser} = useAuthContext()
	
		//TODO add all the routes of the application
		return <>
			<Routes>
				<Route path='/' element={<Navigate to={'/chatPage'} />} />
				<Route path='/register' element={authUser ? <Navigate to="/" /> : <Register />} />
				<Route path='/signin' element={authUser ? <Navigate to="/" /> : <SignIn />} />
				<Route path='/chatPage' element={authUser ? <ChatPage /> : <Navigate to="/signin" />} />
				<Route path='/logout' element={<Logout />} />
				<Route path='*' element={
					<NotFound />
				} />
			</Routes>
		</>
	}
