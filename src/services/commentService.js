const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/comments`

// Get all comments for a specific post
const getCommentsByPostId = async (postId) => {
  try {
    // Add populate parameter to get author information
    const res = await fetch(`${BASE_URL}/${postId}?populate=author`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}

// Create a new comment on a post
const createComment = async (postId, commentData) => {
    try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token found')

        const res = await fetch(`${BASE_URL}/${postId}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Failed to create comment')
        }

        return await res.json()
    } catch (err) {
        throw err
    }
}

// Update an existing comment
const updateComment = async (postId, commentId, content) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const res = await fetch(`${BASE_URL}/${postId}/${commentId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to update comment')
    }

    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}

// Delete a comment
const deleteComment = async (postId, commentId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const res = await fetch(`${BASE_URL}/${postId}/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to delete comment')
    }

    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}

// Reply to a comment
const replyToComment = async (postId, commentId, content) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token found')

    const res = await fetch(`${BASE_URL}/${postId}/${commentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to create reply')
    }

    const data = await res.json()
    return data
  } catch (err) {
    throw err
  }
}

export {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
  replyToComment
}