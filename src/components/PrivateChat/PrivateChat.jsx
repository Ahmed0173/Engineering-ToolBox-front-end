import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChat, sendMessage } from '../../services/chatService'
import './PrivateChat.scss'

const PrivateChat = () => {
    const { chatId } = useParams()
    const navigate = useNavigate()
    const [chat, setChat] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const data = await getChat(chatId)
                setChat(data)
            } catch (error) {
                console.error('Error fetching chat:', error)
                navigate('/chats')
            } finally {
                setLoading(false)
            }
        }

        fetchChat()
    }, [chatId, navigate])

    useEffect(() => {
        scrollToBottom()
    }, [chat?.messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const updatedChat = await sendMessage(chatId, newMessage.trim())
            setChat(updatedChat)
            setNewMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setSending(false)
        }
    }

    const getOtherParticipant = () => {
        const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id
        return chat?.participants.find(p => p._id !== currentUserId)
    }

    const getCurrentUserId = () => {
        return JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id
    }

    if (loading) {
        return <div className="loading">Loading chat...</div>
    }

    if (!chat) {
        return <div className="error">Chat not found</div>
    }

    const otherUser = getOtherParticipant()
    const currentUserId = getCurrentUserId()

    return (
        <div className="private-chat">
            <div className="chat-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/chats')}
                >
                    ← Back
                </button>
                <div className="chat-user-info">
                    <div className="user-avatar">
                        {otherUser?.avatar ? (
                            <img src={otherUser.avatar} alt={otherUser.username} />
                        ) : (
                            <img src="https://cdn.pfps.gg/pfps/2301-default-2.png" alt={otherUser?.username || 'User'} />
                        )}
                    </div>
                    <h2>{otherUser?.username || 'Unknown User'}</h2>
                </div>
            </div>

            <div className="messages-container">
                {chat.messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <div className="messages-list">
                        {chat.messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender._id === currentUserId ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    <p>{message.content}</p>
                                    <span className="message-time">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                >
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    )
}

export default PrivateChat