import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPassord from './pages/ForgotPassword'
import {Toaster} from "react-hot-toast"
import { AppContext } from './context/AppContext'

const App = () => {
  const {authUser} = useContext(AppContext)
  return (
    <div className='w-screen h-screen bg-[#0f0f0f]'>
      <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>: <Navigate to={"/login"}/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to={"/login"}/>}/>
        <Route path='/forgotPassword' element={<ForgotPassord/>}/>
      </Routes>
    </div>
  )
}

export default App