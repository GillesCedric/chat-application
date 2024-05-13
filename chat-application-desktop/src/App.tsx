import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './pages/404'
import { Logout } from './components/Logout'
import '../styles/global.css'
import Register from './pages/register'
import SignIn from './pages/signin'
import { useAuthContext } from './context/AuthContext'
import ChatPage from './pages/ChatPage'
import { FriendRequest } from './pages/FriendRequests'
import ForgotPassword from './components/ForgotPassword'
import VerifyPage from './pages/VerifyPage'
import { Settings } from './pages/Settings'


export default function App() {
	const {authUser} = useAuthContext()
	
		//TODO add all the routes of the application
		return (
      <>
        <Routes>
          <Route path="/" element={<Navigate to={"/chatPage"} />} />
          <Route
            path="/register"
            element={authUser ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/signin"
            element={authUser ? <Navigate to="/" /> : <SignIn />}
          />
          <Route
            path="/chatPage"
            element={authUser ? <ChatPage /> : <Navigate to="/signin" />}
          />
          <Route
            path="/friendsRequests"
            element={authUser ? <FriendRequest /> : <Navigate to="/signin" />}
          />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyPage" element={<VerifyPage isTelVerification = {true} />} />

          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
	}
