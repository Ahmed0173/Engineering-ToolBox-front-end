import React from 'react';
import './PrivateChatModal.scss';

const PrivateChatModal = ({ user, onStartChat, onClose }) => {
    if (!user) return null;
    return (
        <div className="private-chat-modal-overlay">
            <div className="private-chat-modal">
                <h3>Start Private Chat</h3>
                <p>Do you want to start a private chat with <strong>@{user.username}</strong>?</p>
                <div className="modal-actions">
                    <button className="start-chat-btn" onClick={onStartChat}>Start Chat</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PrivateChatModal;
