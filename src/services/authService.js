const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.err || 'Something went wrong')

    if (data.token) {
      localStorage.setItem('token', data.token)
      const decodedToken = JSON.parse(atob(data.token.split('.')[1]))
      return decodedToken
    }

  } catch (err) {
    throw err
  }
}

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.err || 'Sign in failed')
    }
    
    if (data.token) {
      localStorage.setItem('token', data.token)
      const decodedToken = JSON.parse(atob(data.token.split('.')[1]))
      return decodedToken
    }
  } catch (err) {
    throw err
  }
}

const getUser = () => {
  const token = localStorage.getItem('token')
  if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]))
      return decodedToken
  } else {
    return null
  }
}

const signOut = () => {
  localStorage.removeItem('token')
}

export {
  signUp,
  signIn,
  getUser,
  signOut,
}