import PostsPage from "./components/PostsPage/PostsPage";
import './App.scss'
import React from 'react'
import Header from './components/Header/Header.jsx'   // <-- Uppercase import name
import { Routes, Route } from 'react-router-dom'

const Home = () => <h1 style={{padding:'1rem'}}>Engineering ToolBox</h1>

export default function App() {
  return (
    <>
      <Header /> {/* <-- Render as a component */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* add more routes later */}
      </Routes>
        <div>
         <PostsPage />
       </div>
    </>
  );
}
export default App