import PostsPage from "./components/PostsPage/PostsPage";
import './App.scss'
import React from 'react'
import Header from './components/Header/Header.jsx'
import SignUp from './components/SignUp/SignUp.jsx';
import { Routes, Route } from 'react-router-dom'

const Home = () => <h1 style={{padding:'1rem'}}>Engineering ToolBox</h1>

export default function App() {
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
      </Routes>
      <div>
        <PostsPage />
      </div>
    </>
  );
}
