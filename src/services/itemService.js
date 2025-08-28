const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/items`

const index = async () => {
  try {
    const res = await fetch(BASE_URL)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const show = async (itemId) => {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const create = async (formData) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(BASE_URL, {
      method: 'POST',
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

const createComment = async (formData, itemId) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${itemId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    return data
}

const deleteItem = async (itemId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch(err) {
    console.log(err)
  }
}

async function update(itemId, itemFormData) {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

const deleteComment = async (itemId, commentId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${itemId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
};

const updateComment = async (itemId, commentId, commentFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  index,
  show,
  create,
  createComment,
  deleteItem,
  update,
  deleteComment,
  updateComment
}