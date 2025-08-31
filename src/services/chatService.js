const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/chats`

const getChats = async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(BASE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        return await res.json()
    } catch (err) {
        console.error('Error in getChats:', err)
        throw err
    }
}

const getChat = async (chatId) => {
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${BASE_URL}/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        return await res.json()
    } catch (err) {
        console.error('Error in getChat:', err)
        throw err
    }
}

const sendMessage = async (chatId, content) => {
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${BASE_URL}/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        })
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        return await res.json()
    } catch (err) {
        console.error('Error in sendMessage:', err)
        throw err
    }
}

export {
    getChats,
    getChat,
    sendMessage
}