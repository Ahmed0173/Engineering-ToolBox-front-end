// SignIn form

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../Header/Header'

const SignIn = (props) => {
  const navigate = useNavigate()

  const initialState = {
    username: '',
    password: '',
  }

  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState('')


  

  useEffect(() => {
    if (props.user) {
      navigate('/')
    }
  }, [props.user, navigate])

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
    setError('')
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    try {
      await props.handleSignIn(formData)
      navigate('/')
    } catch (err) {
      setError('Sign in failed. Please check your credentials.')
    }
  }

  return (
    <div className="auth-container">
      <div className="vintage-decoration top-right"> ҉ </div>
      <div className="auth-header">
        <h1>Welcome Back!</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <div className="auth-error">{error}</div>}
        <br />
        <button type="submit" className="auth-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn