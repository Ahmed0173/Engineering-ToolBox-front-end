import React from 'react';
import './DeletePostModal.scss';

const DeletePostModal = ({ post, onConfirmDelete, onClose }) => {
    if (!post) return null;

    return (
        <div className="delete-post-modal-overlay">
            <div className="delete-post-modal">
                <h3>Delete Post</h3>
                <p>Are you sure you want to delete this post?</p>
                <div className="post-preview">
                    <p>"{post.content?.substring(0, 100)}{post.content?.length > 100 ? '...' : ''}"</p>
                </div>
                <p className="warning-text">This action cannot be undone.</p>
                <div className="modal-actions">
                    <button className="delete-confirm-btn" onClick={onConfirmDelete}>Delete Post</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeletePostModal;
