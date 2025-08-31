// index all private chats for the logged-in user
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChats } from '../../services/chatService'
import './PrivateChats.scss'

const PrivateChats = () => {
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChats()
                setChats(data)
            } catch (error) {
                console.error('Error fetching chats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchChats()
    }, [])

    const handleChatClick = (chatId) => {
        navigate(`/chats/${chatId}`)
    }

    const getOtherParticipant = (chat) => {
        const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id
        return chat.participants.find(p => p._id !== currentUserId)
    }

    if (loading) {
        return <div className="loading">Loading chats...</div>
    }

    return (
        <div className="private-chats">
            <h2>Your Conversations</h2>

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
                                        <div className="default-avatar">
                                            {otherUser?.username?.[0]?.toUpperCase() || '?'}
                                        </div>
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