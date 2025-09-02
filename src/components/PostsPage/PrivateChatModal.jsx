import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivateChatModal.scss';

const PrivateChatModal = ({ user, onStartChat, onClose }) => {
    const navigate = useNavigate();

    const handleShowProfile = () => {
        navigate(`/profile/${user._id}`);
        onClose(); // Close the modal after navigation
    };

    if (!user) return null;
    return (
        <div className="private-chat-modal-overlay">
            <div className="private-chat-modal">
                <div className="modal-header">
                    <h3>@{user.username}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <p>What would you like to do?</p>

                <div className="modal-actions">
                    <button className="show-profile-btn" onClick={handleShowProfile}>
                        👤 Show Profile
                    </button>
                    <button className="start-chat-btn" onClick={onStartChat}>
                        💬 Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivateChatModal;
