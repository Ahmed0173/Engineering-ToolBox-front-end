// index all private chats for the logged-in user
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getChats, startChat } from '../../services/chatService'
import './PrivateChats.scss'

const PrivateChats = () => {
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [startingChat, setStartingChat] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const selectedUser = location.state?.selectedUser

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChats()
                setChats(data)

                // If we have a selectedUser from navigation, check if chat exists or start new one
                if (selectedUser) {
                    await handleSelectedUser(data)
                }
            } catch (error) {
                console.error('Error fetching chats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchChats()
    }, [selectedUser])

    const handleSelectedUser = async (existingChats) => {
        try {
            const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id

            // Check if a chat with this user already exists
            const existingChat = existingChats.find(chat =>
                chat.participants.some(p => p._id === selectedUser._id)
            )

            if (existingChat) {
                // Navigate to existing chat
                navigate(`/chats/${existingChat._id}`, { replace: true })
            } else {
                // Start a new chat
                setStartingChat(true)
                const newChat = await startChat(selectedUser._id)
                navigate(`/chats/${newChat._id}`, { replace: true })
            }
        } catch (error) {
            console.error('Error handling selected user:', error)
            setStartingChat(false)
            // Show the user an error message but stay on the chats page
            alert('Failed to start chat. Please try again.')
        }
    }

    const handleChatClick = (chatId) => {
        navigate(`/chats/${chatId}`)
    }

    const getOtherParticipant = (chat) => {
        const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id
        return chat.participants.find(p => p._id !== currentUserId)
    }

    if (loading || startingChat) {
        return (
            <div className="loading">
                {startingChat ? 'Starting chat...' : 'Loading chats...'}
            </div>
        )
    }

    return (
        <div className="private-chats">
            <h2>Your Conversations</h2>

            {selectedUser && (
                <div className="starting-chat-notice">
                    <p>Starting chat with <strong>@{selectedUser.username}</strong>...</p>
                </div>
            )}

            {chats.length === 0 ? (
                <div className="no-chats">
                    <p>No conversations yet. Start chatting with other users!</p>
                </div>
            ) : (
                <div className="chats-list">
                    {chats.map(chat => {
                        const otherUser = getOtherParticipant(chat)
                        return (
                            <div
                                key={chat._id}
                                className="chat-item"
                                onClick={() => handleChatClick(chat._id)}
                            >
                                <div className="chat-avatar">
                                    {otherUser?.avatar ? (
                                        <img src={otherUser.avatar} alt={otherUser.username} />
                                    ) : (
                                        <img src="https://cdn.pfps.gg/pfps/2301-default-2.png" alt={otherUser?.username || 'User'} />
                                    )}
                                </div>

                                <div className="chat-content">
                                    <div className="chat-header">
                                        <h3>{otherUser?.username || 'Unknown User'}</h3>
                                        <span className="last-message-time">
                                            {chat.lastMessageAt ?
                                                new Date(chat.lastMessageAt).toLocaleDateString()
                                                : ''
                                            }
                                        </span>
                                    </div>

                                    <p className="last-message">
                                        {chat.lastMessage || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default PrivateChats