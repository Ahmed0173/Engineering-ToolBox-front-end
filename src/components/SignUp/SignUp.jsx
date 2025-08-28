import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = (props) => {
  const navigate = useNavigate()

  const initialState = {
    username: '',
    email:'',
    password: '',
    passwordConf: '',
  }

  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState(null)


  useEffect(() => {
    if (props.user) {
      navigate('/')
    }
  }, [props.user])

  const handleChange = (evt) => {
    setFormData({...formData, [evt.target.name]: evt.target.value})
  }

  const handleSubmit = async (evt) => {

    evt.preventDefault()  

    const result = await props.handleSignUp(formData)
    if (result.success){
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  let formIsInvalid = true

  if (formData.username && formData.password && formData.password === formData.passwordConf) {
    formIsInvalid = false
  }

   return (
    <div className="auth-container">
      <div className="vintage-decoration top-right"> ҉</div>
      <div className="auth-header">
        <h1>Join Our Community</h1>
        <p>Shop Second-Hand.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            onChange={handleChange}
            placeholder="Choose a username"
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
        
        <div className="form-group">
          <label>Confirm Password:</label>
          <input 
            type="password" 
            name="passwordConf" 
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          </div>

        <br />
        <button type="submit" className="auth-button" disabled={formIsInvalid}>Sign up</button>
      </form>
    </div>
  );
};

export default SignUp