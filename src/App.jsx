import React, { useState } from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import PostsPage from './components/PostsPage/PostsPage'
import './App.scss'
import { Routes, Route } from 'react-router-dom'

// Dummy Home component
const Home = () => <h1 style={{ padding: '1rem' }}>Engineering ToolBox</h1>

export default function App() {
  // User state
  const [user, setUser] = useState(null)

  // Dummy sign up handler for testing
  const handleSignUp = async (formData) => {
    await new Promise((res) => setTimeout(res, 500))
    return { success: true }
  }

  // Example sign in handler
  const handleSignIn = async (formData) => {
    try {
      // Replace with real API logic later
      setUser({ username: formData.username, email: formData.email })
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const handleSignOut = () => {
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
