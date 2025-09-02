import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './SignUp.scss'

const SignUp = (props) => {
    const navigate = useNavigate()

    const initialState = {
        username: '',
        email: '',
        password: '',
        passwordConf: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [error, setError] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})

    useEffect(() => {
        if (props.user) {
            navigate('/')
        }
    }, [props.user])

    const validateField = (name, value) => {
        const errors = { ...fieldErrors }

        switch (name) {
            case 'username':
                if (!value) {
                    errors.username = 'Username is required'
                } else if (value.length < 3) {
                    errors.username = 'Username must be at least 3 characters'
                } else if (value.length > 20) {
                    errors.username = 'Username must be less than 20 characters'
                } else {
                    delete errors.username
                }
                break
            case 'email':
                if (!value) {
                    errors.email = 'Email is required'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = 'Please enter a valid email address'
                } else {
                    delete errors.email
                }
                break
            case 'password':
                if (!value) {
                    errors.password = 'Password is required'
                } else {
                    delete errors.password
                }
                // Also validate password confirmation if it exists
                if (formData.passwordConf && value !== formData.passwordConf) {
                    errors.passwordConf = 'Passwords do not match'
                } else if (formData.passwordConf && value === formData.passwordConf) {
                    delete errors.passwordConf
                }
                break
            case 'passwordConf':
                if (!value) {
                    errors.passwordConf = 'Please confirm your password'
                } else if (value !== formData.password) {
                    errors.passwordConf = 'Passwords do not match'
                } else {
                    delete errors.passwordConf
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
            const result = await props.handleSignUp(formData)
            if (result.success) {
                navigate('/')
            } else {
                setError(result.message || 'Sign up failed. Please try again.')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        }
    }

    const formIsInvalid = !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.passwordConf ||
        formData.password !== formData.passwordConf ||
        Object.keys(fieldErrors).length > 0

    return (
        <div className="auth-container">
            <div className="vintage-decoration top-right"> ❋ </div>
            <div className="auth-header">
                <h1>Join Our Community</h1>
                <p>Create your account to start engineering</p>
                {error && <div className="error-message general-error">{error}</div>}
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className={`form-group ${fieldErrors.username ? 'invalid' : formData.username ? 'valid' : ''}`}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a unique username"
                        required
                    />
                    {fieldErrors.username && <div className="error-message">{fieldErrors.username}</div>}
                </div>

                <div className={`form-group ${fieldErrors.email ? 'invalid' : formData.email ? 'valid' : ''}`}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                    />
                    {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}
                </div>

                <div className={`form-group ${fieldErrors.password ? 'invalid' : formData.password ? 'valid' : ''}`}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        required
                    />
                    {fieldErrors.password && <div className="error-message">{fieldErrors.password}</div>}
                </div>

                <div className={`form-group ${fieldErrors.passwordConf ? 'invalid' : formData.passwordConf && formData.password === formData.passwordConf ? 'valid' : ''}`}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="passwordConf"
                        value={formData.passwordConf}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                    {fieldErrors.passwordConf && <div className="error-message">{fieldErrors.passwordConf}</div>}
                </div>

                <div className="link-container">
                    Already have an account? <Link to="/SignIn">Sign in</Link>
                </div>

                <button type="submit" className="auth-button" disabled={formIsInvalid}>
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default SignUp