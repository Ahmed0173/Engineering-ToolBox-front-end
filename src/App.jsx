import "./App.scss";
import NavBar from "./components/NavBar/NavBar";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import ItemDetails from "./components/ItemDetails/ItemDetails.jsx";
import ItemForm from "./components/ItemForm/ItemForm.jsx";
import ItemList from "./components/ItemList/ItemList.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import * as authService from "./services/authService.js";
import * as itemService from "./services/itemService.js";
import { useState, useEffect } from "react";
import CommentForm from "./components/CommentForm/CommentForm.jsx";
import Footer from './components/Footer/Footer';
import Loader from './components/Loading/loader.jsx';
import HomePage from "./components/Homepage/Homepage.jsx";
import Profile from "./components/Profile/Profile.jsx";
const App = () => {

  const navigate = useNavigate()

  const initialState = authService.getUser()

  const [user, setUser] = useState(initialState)
  const [item, setItem] = useState([])

  useEffect(() => {
    const fetchAllItems = async () => {
      const itemsData = await itemService.index()
      setItem(itemsData)
    }
    fetchAllItems()
  }, [])


  const handleSignUp = async (formData) => {
    try {
      const res = await authService.signUp(formData)
      setUser(res)
      return { success: true }
    } catch(err){
      return { success: false, message: err.message }
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const handleSignIn = async (formData) => {
    const res = await authService.signIn(formData)
    setUser(res)
  }

const handleAddItem = async (formData) => {
  const newItem = await itemService.create(formData);
  setItem([newItem, ...item]); 
  navigate('/items');
};

  const handleDeleteItem = async (itemId) => {
    await itemService.deleteItem(itemId)
    setItem(item.filter(item => item._id !== itemId))
    navigate('/items')
  }

const handleUpdateItem = async (itemId, itemFormData) => {
  const updatedItem = await itemService.update(itemId, itemFormData);
  setItem(item.map((item) => (itemId === item._id ? updatedItem : item)));
  navigate(`/items/${itemId}`);
};


  return (
    <div className="app-container"> 
      <NavBar user={user} handleSignOut={handleSignOut} />
    <main className="main-content">
      <Routes>
          {user ? (
            <>
              <Route path='items/new' element={<ItemForm handleAddItem={handleAddItem} user={user}/>} />
              <Route path='items/:itemId/edit' element={<ItemForm handleUpdateItem={handleUpdateItem}/>}/>
            </>
          ) : (
            
            <>
              <Route path='/sign-up' element={<SignUp handleSignUp={handleSignUp} user={user} />} />
              <Route path='/sign-in' element={<SignIn handleSignIn={handleSignIn} user={user} />} />
            </>
          )}
         <Route 
  path="/" 
  element={<HomePage user={user} items={item} />} 
/>
        <Route path='/items' element={<ItemList item={item} />} />
          <Route path='/items/:itemId' element={<ItemDetails user={user} handleDeleteItem={handleDeleteItem} />} />
          <Route 
  path="/profile" 
  element={<Profile user={user} handleDeleteItem={handleDeleteItem} />} 
/>
        <Route path='*' element={
          <div className="not-found">
            <h1>404</h1>
            <p>Page not found</p>
          </div>
        } />
      </Routes>
    </main>
    <Footer user={user} />
  </div>
)
}

export default App