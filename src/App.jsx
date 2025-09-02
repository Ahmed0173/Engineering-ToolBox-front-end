import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import PostsPage from './components/PostsPage/PostsPage'
import PostForm from './components/PostForm/PostForm.jsx'
import HomePage from './components/HomePage/HomePage.jsx'
import CalculatorPage from './components/Calculator/CalculatorPage.jsx'
import './App.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import * as authService from './services/authService'
import { getProfile } from './services/profileService'

import PrivateChats from './components/PrivateChats/PrivateChats.jsx'
import PrivateChat from './components/PrivateChat/PrivateChat.jsx'
import UserProfile from './components/UserProfile/UserProfile.jsx'
import PostDetails from './components/PostDetails/PostDetails.jsx'
import { createPost, updatePost } from './services/postService.js'
import ProfileEdit from './components/UserProfile/ProfileEdit.jsx'

export default function App() {
  // User state
  const [user, setUser] = useState(null)

  // Check for existing user on app startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Try to get full profile instead of just token data
          const profileData = await getProfile()
          setUser(profileData.user || profileData)
        } catch (error) {
          // If profile fetch fails, fall back to token data
          console.log('Failed to fetch profile, using token data')
          const existingUser = authService.getUser()
          if (existingUser) {
            setUser(existingUser)
          }
        }
      }
    }

    loadUser()
  }, [])

  // Real sign up handler using authService
  const handleSignUp = async (formData) => {
    try {
      const user = await authService.signUp(formData)
      // After signup, fetch full profile
      try {
        const profileData = await getProfile()
        setUser(profileData.user || profileData)
      } catch (error) {
        setUser(user) // fallback to token data
      }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  // Real sign in handler using authService
  const handleSignIn = async (formData) => {
    try {
      const user = await authService.signIn(formData)
      // After signin, fetch full profile
      try {
        const profileData = await getProfile()
        setUser(profileData.user || profileData)
      } catch (error) {
        setUser(user) // fallback to token data
      }
    } catch (err) {
      // Pass through the original error message from the server
      throw err
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
      const updatedPost = await updatePost(postId, postData)
      return updatedPost
    } catch (error) {
      throw new Error('Failed to update post')
    }
  }

  return (
    <>
      <Header user={user} handleSignOut={handleSignOut} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/auth/signup" element={<SignUp handleSignUp={handleSignUp} />} />
        <Route path="/auth/signin" element={<SignIn user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut} />} />
        <Route path="/profile/edit" element={user ? <ProfileEdit user={user} onUpdated={setUser} /> : <Navigate to="/signin" replace />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/posts/:postId/edit" element={user ? (<PostForm handleAddPost={handleAddPost} handleUpdatePost={handleUpdatePost} />) : (<Navigate to="/auth/signin" replace />)} />
        <Route path="/calculator" element={<CalculatorPage />} />

        {/* Private Routes (require authentication) */}
        <Route path="/users/profile" element={<UserProfile user={user} />} />
        <Route path="/posts/new" element={user ? (<PostForm handleAddPost={handleAddPost} handleUpdatePost={handleUpdatePost} />) : (<Navigate to="/auth/signin" replace />)} />
        <Route path="/chats" element={user ? <PrivateChats /> : <Navigate to="/auth/signin" replace />} />
        <Route path="/chats/:chatId" element={user ? <PrivateChat /> : <Navigate to="/auth/signin" replace />} />

        {/* Legacy redirects */}
        <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/signin" element={<Navigate to="/auth/signin" replace />} />
        <Route path="/sign-up" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/sign-in" element={<Navigate to="/auth/signin" replace />} />
        <Route path="/profile" element={<Navigate to="/users/profile" replace />} />
        <Route path="/PostForm" element={<Navigate to="/posts/new" replace />} />
        <Route path="/private-chats" element={<Navigate to="/chats" replace />} />
      </Routes>
    </>
  )
}