import PostsPage from "./components/PostsPage/PostsPage";
import './App.scss'
<<<<<<< Updated upstream
import React from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx';
=======
import React, { useState } from 'react'
import Header from './components/Header/Header.jsx'
>>>>>>> Stashed changes
import { Routes, Route } from 'react-router-dom'
import SignIn from './components/SignIn/SignIn.jsx'

// Dummy Home component
const Home = () => <h1 style={{padding:'1rem'}}>Engineering ToolBox</h1>

export default function App() {
<<<<<<< Updated upstream
  // Dummy sign up handler for testing
  const handleSignUp = async (formData) => {
    // Simulate API call delay
    await new Promise(res => setTimeout(res, 500));
    // Always succeed for demo
    return { success: true };
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp handleSignUp={handleSignUp} />} />
        {/* add more routes later */}
=======
  // Example user state and sign-in handler
  const [user, setUser] = useState(null)

  const handleSignIn = async (formData) => {
    // Replace with your real auth logic
    try {
      // const res = await authService.signIn(formData)
      // setUser(res)
      // return { success: true }
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
>>>>>>> Stashed changes
      </Routes>
      <div>
        <PostsPage />
      </div>
    </>
<<<<<<< Updated upstream
  );
}
=======
  )
}
>>>>>>> Stashed changes
