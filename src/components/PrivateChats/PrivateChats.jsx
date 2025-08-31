// index all private chats for the logged-in user
import React, { useEffect, useState } from 'react'
import { getChats } from '../../services/chatService'

const PrivateChats = () => {
    const [chats, setChats] = useState([])

    useEffect(() => {
        const fetchChats = async () => {
            try {
                console.log('Fetching chats...')
                const data = await getChats()
                console.log('Chats data:', data)
                setChats(data)
            } catch (error) {
                console.error('Error fetching chats:', error)
            }
        }

        fetchChats()
    }, [])

    return (
        <div>
            <h2>Your Private Chats</h2>
            <p>Number of chats: {chats.length}</p>
            <ul>
                {chats.map(chat => (
                    <li key={chat._id}>Chat ID: {chat._id}</li>
                ))}
            </ul>
        </div>
    )
}

export default PrivateChats