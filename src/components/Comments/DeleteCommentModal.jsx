import React from 'react';
import './DeleteCommentModal.scss';

const DeleteCommentModal = ({ comment, onConfirmDelete, onClose, isReply = false }) => {
    if (!comment) return null;

    return (
        <div className="delete-comment-modal-overlay">
            <div className="delete-comment-modal">
                <h3>Delete {isReply ? 'Reply' : 'Comment'}</h3>
                <p>Are you sure you want to delete this {isReply ? 'reply' : 'comment'}?</p>
                <div className="comment-preview">
                    <p>"{comment.content?.substring(0, 150)}{comment.content?.length > 150 ? '...' : ''}"</p>
                </div>
                <p className="warning-text">This action cannot be undone.</p>
                <div className="modal-actions">
                    <button className="delete-confirm-btn" onClick={onConfirmDelete}>
                        Delete {isReply ? 'Reply' : 'Comment'}
                    </button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCommentModal;
