const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/chats`

const getChats = async () => {
    try {
    const token = localStorage.getItem('token')
    console.log('Token:', token ? 'Token exists' : 'No token found')
    console.log('Fetching from:', BASE_URL)
    
    const res = await fetch(BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    
    console.log('Response status:', res.status)
    
    if (!res.ok) {
      const errorText = await res.text()
      console.log('Error response:', errorText)
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    console.log('Chat service data:', data)
    return data
  } catch (err) {
    console.error('Error in getChats:', err)
    throw err
  }
};

export {
    getChats
}