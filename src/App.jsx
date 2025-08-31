import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import PostsPage from './components/PostsPage/PostsPage'
import './App.scss'
import { Routes, Route } from 'react-router-dom'
import * as authService from './services/authService'

// Dummy Home component
const Home = () => <h1 style={{ padding: '1rem' }}>Engineering ToolBox</h1>

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
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp handleSignUp={handleSignUp} />} />
        <Route
          path="/sign-in"
          element={
            <SignIn
              user={user}
              handleSignIn={handleSignIn}
              handleSignOut={handleSignOut}
            />
          }
        />
        {/* Add more routes as needed */}
      </Routes>
      <div>
        <PostsPage />
      </div>
    </>
  )
}
