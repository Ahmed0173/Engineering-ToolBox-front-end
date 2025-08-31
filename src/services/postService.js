const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/posts`

const getAllPosts = async () => {
  try {
    const res = await fetch(BASE_URL)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Error in getAllPosts:', err)
    throw err
  }
}

const getPostById = async (postId) => {
  try {
    const res = await fetch(`${BASE_URL}/${postId}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const createPost = async (formData) => {
  console.log(formData)
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')


    
    const res = await fetch(`${BASE_URL}/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
    
    // Log the raw response for debugging
    const rawResponse = await res.text()
    console.log('Raw server response:', rawResponse)
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(rawResponse)
    } catch (e) {
      console.error('Failed to parse response as JSON:', rawResponse)
      throw new Error('Server returned invalid JSON response')
    }
    
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`)
    }
    
    return data
  } catch (err) {
    console.error('Create post error:', err)
    throw err
  }
}

const updatePost = async (postId, formData) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${postId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${postId}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const likePost = async (postId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Error in likePost:', err)
    throw err
  }
}

const savePost = async (postId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${postId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const getLikedPosts = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/users/liked-posts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const getSavedPosts = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/users/saved-posts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  savePost,
  getLikedPosts,
  getSavedPosts
}
