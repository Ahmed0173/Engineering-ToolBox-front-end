import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import PostsPage from './components/PostsPage/PostsPage'
import PostForm from './components/postForm/postForm.jsx'
import './App.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import * as authService from './services/authService'
import { createPost, updatePost } from './services/postService.js'

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

const handleAddPost = async (postData) => {
  try {
    console.log('Attempting to create post with data:', postData)
    // Fix: Use named import instead of PostService.create
    const newPost = await createPost(postData)
    console.log('Post created successfully:', newPost)
    return newPost
  } catch (error) {
    console.error('Failed to create post:', error)
    throw error // Remove the extra error wrapping
  }
}

  const handleUpdatePost = async (postId, postData) => {
    try {
      const updatedPost = await PostService.update(postId, postData)
      return updatedPost
    } catch (error) {
      throw new Error('Failed to update post')
    }
  }

  return (
    <>
      <Header user={user} handleSignOut={handleSignOut} />
      <Routes>
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

        <Route
          path="/PostForm"
          element={
            user ? (
              <PostForm 
                handleAddPost={handleAddPost}
                handleUpdatePost={handleUpdatePost}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        
        {/* Legacy redirects */}
        <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
        <Route path="/sign-in" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  )
}
