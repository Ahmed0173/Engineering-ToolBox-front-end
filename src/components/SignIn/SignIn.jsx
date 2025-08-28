import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SignIn = (props) => {
  const navigate = useNavigate()

  const initialState = {
    username: '',
    password: '',
    email: '',
  }

  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (props.user) {
      navigate('/')
    }
  }, [props.user])

  const handleChange = (evt) => {
    setFormData({...formData, [evt.target.name]: evt.target.value})
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    props.handleSignIn(formData)
    navigate('/')
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
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            onChange={handleChange}
            placeholder="email@provider.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        <br />
        <button type="submit" className="auth-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn