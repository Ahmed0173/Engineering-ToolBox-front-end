import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import PostsPage from './components/PostsPage/PostsPage'
import './App.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import * as authService from './services/authService'
import UserProfile from './components/UserProfile/UserProfile.jsx'

// Home component
const Home = () => (
  <div className="homepage">
    <h1>Engineering ToolBox</h1>
    <p>Your comprehensive platform for engineering calculations, formulas, and community knowledge sharing.</p>
  </div>
)

export default function App() {
  // User state
  const [user, setUser] = useState(null)

  // Check for existing user on app startup
  useEffect(() => {
    const existingUser = authService.getUser()
    if (existingUser) {
      setUser(existingUser)
    }
  }, [])

  // Real sign up handler using authService
  const handleSignUp = async (formData) => {
    try {
      const user = await authService.signUp(formData)
      setUser(user)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  // Real sign in handler using authService
  const handleSignIn = async (formData) => {
    try {
      const user = await authService.signIn(formData)
      setUser(user)
    } catch (err) {
      throw new Error('Sign in failed. Please check your credentials.')
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <>
      <Header user={user} handleSignOut={handleSignOut} />
      <Routes>
        <Route path="/profile" element={<UserProfile user={user} />} />
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/signup" element={<SignUp handleSignUp={handleSignUp} />} />
        <Route
          path="/signin"
          element={
            <SignIn
              user={user}
              handleSignIn={handleSignIn}
              handleSignOut={handleSignOut}
            />
          }
        />
        <Route path="/profile" element={<UserProfile user={user} />} />
        {/* Legacy redirects */}
        <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
        <Route path="/sign-in" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  )
}