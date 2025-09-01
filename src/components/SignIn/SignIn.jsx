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
    const [error, setError] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})




    useEffect(() => {
        if (props.user) {
            navigate('/')
        }
    }, [props.user, navigate])

    const validateField = (name, value) => {
        const errors = { ...fieldErrors }

        switch (name) {
            case 'username':
                if (!value) {
                    errors.username = 'Username is required'
                } else if (value.length < 3) {
                    errors.username = 'Username must be at least 3 characters'
                } else {
                    delete errors.username
                }
                break
            case 'password':
                if (!value) {
                    errors.password = 'Password is required'
                } else {
                    delete errors.password
                }
                break
            default:
                break
        }

        setFieldErrors(errors)
        return errors
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setFormData({ ...formData, [name]: value })

        // Clear general error when user starts typing
        if (error) setError(null)

        // Validate field on change
        validateField(name, value)
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        // Final validation check for all fields
        const allErrors = {}
        Object.keys(formData).forEach((key) => {
            const errors = validateField(key, formData[key])
            Object.assign(allErrors, errors)
        })

        // Check if there are any errors before submitting
        if (Object.keys(allErrors).length > 0) {
            setError('Please fix the errors in the form')
            return
        }

        try {
            await props.handleSignIn(formData)
            navigate('/')
        } catch (err) {
            console.log('Sign in error:', err)
            // Handle different types of errors
            if (err.message) {
                // Check for specific error messages from the backend
                if (err.message.includes('Invalid credentials')) {
                    setError('Invalid username or password. Please try again.')
                } else if (err.message.includes('Sign in failed')) {
                    setError('Sign in failed. Please check your credentials.')
                } else {
                    setError(err.message)
                }
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        }
    }

    const formIsInvalid = !formData.username ||
        !formData.password ||
        Object.keys(fieldErrors).length > 0

    return (
        <div className="auth-container">
            <div className="vintage-decoration top-right"> ҉ </div>
            <div className="auth-header">
                <h1>Welcome Back!</h1>
                {error && <div className="error-message general-error">{error}</div>}
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
                    {fieldErrors.username && <div className="error-message">{fieldErrors.username}</div>}
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
                    {fieldErrors.password && <div className="error-message">{fieldErrors.password}</div>}
                </div>
                <br />
                <button type="submit" className="auth-button" disabled={formIsInvalid}>Sign In</button>
            </form>
        </div>
    );
};

export default SignIn