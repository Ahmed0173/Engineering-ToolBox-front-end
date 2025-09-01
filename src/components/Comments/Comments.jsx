import React, { useState, useEffect } from 'react'
import {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
} from '../../services/commentService'
import './Comments.scss'

const Comments = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [editingComment, setEditingComment] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Helper function to get author display name
    const getAuthorDisplayName = (comment) => {
        // Backend uses user_id field, not author
        const author = comment.user_id || comment.author;

        if (author && typeof author === 'object' && author.username) {
            return author.username
        }
        if (comment.username) {
            return comment.username
        }
        if (author && typeof author === 'object') {
            if (author.name) {
                return author.name
            }
            if (author.displayName) {
                return author.displayName
            }
        }
        if (currentUser && currentUser.username &&
            (author === currentUser._id ||
                author === currentUser.id ||
                (typeof author === 'string' && author === currentUser._id))) {
            return currentUser.username
        }
        if (currentUser && currentUser.username) {
            const possibleUserIds = [currentUser._id, currentUser.id, currentUser.userId]
            const commentAuthorId = typeof author === 'object' ?
                (author._id || author.id || author.userId) : author
            if (possibleUserIds.some(id => id && String(id) === String(commentAuthorId))) {
                return currentUser.username
            }
        }
        if (comment.authorName) {
            return comment.authorName
        }
        if (comment.authorUsername) {
            return comment.authorUsername
        }
        return 'Anonymous'
    }

    // Helper function to check if current user owns the comment
    const isCommentOwner = (comment) => {
        if (!currentUser) return false

        // Get current user ID (try different properties)
        const currentUserId = currentUser._id || currentUser.id || currentUser.userId

        // Backend uses user_id field, not author
        const author = comment.user_id || comment.author;

        // Check if author is an object with _id
        if (author && typeof author === 'object') {
            const commentAuthorId = author._id || author.id || author.userId
            return commentAuthorId === currentUserId
        }

        // Check if author is a string (user ID)
        if (typeof author === 'string') {
            return author === currentUserId
        }

        // Fallback: check if the comment was created by current user (temporary solution)
        // This assumes comments created in this session belong to current user
        if (!author && comment.username === currentUser.username) {
            return true
        }

        return false
    }

    useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        try {
            setLoading(true)
            setError('')
            const fetchedComments = await getCommentsByPostId(postId)
            setComments(fetchedComments)
        } catch (err) {
            console.error('Error fetching comments:', err)
            setError('Failed to load comments. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!currentUser) {
            setError('Please sign in to comment')
            return
        }

        const trimmedComment = newComment.trim()
        if (!trimmedComment) {
            setError('Comment cannot be empty')
            return
        }

        try {
            const commentData = {
                content: trimmedComment
                // The backend will automatically set user_id from the token
            }
            await createComment(postId, commentData)
            await fetchComments()
            setNewComment('')
            setError('')
        } catch (err) {
            console.error('Error posting comment:', err)
            const errorMessage = err.message || 'Failed to post comment. Please try again.'
            setError(errorMessage)
        }
    }

    const handleEdit = async (commentId) => {
        if (!editContent.trim()) {
            setError('Comment cannot be empty')
            return
        }

        try {
            const updatedComment = await updateComment(postId, commentId, {
                content: editContent
            })
            setComments(comments.map(c =>
                c._id === commentId ? updatedComment : c
            ))
            setEditingComment(null)
            setEditContent('')
            setError('')
        } catch (err) {
            console.error('Error editing comment:', err)
            const errorMessage = err.message || 'Failed to edit comment. Please try again.'
            setError(errorMessage)
        }
    }

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return

        try {
            await deleteComment(postId, commentId)
            setComments(comments.filter(c => c._id !== commentId))
            setError('')
        } catch (err) {
            console.error('Error deleting comment:', err)
            const errorMessage = err.message || 'Failed to delete comment. Please try again.'
            setError(errorMessage)
        }
    }

    return (

        <div className="comments-section">
            <h3>Comments</h3>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUser ? "Write a comment..." : "Please sign in to comment"}
                    disabled={!currentUser}
                    required
                    rows={3}
                    aria-label="Write a new comment"
                />
                {error && <p className="error-message" role="alert">{error}</p>}
                <button
                    type="submit"
                    disabled={!currentUser || !newComment.trim()}
                    className="submit-btn"
                >
                    Post Comment
                </button>
            </form>


            {loading ? (
                <div className="loading">Loading comments...</div>
            ) : (
                <div className="comments-list">
                    {comments.length === 0 ? (
                        <div className="no-comments">
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <div className="comment-header">
                                    <span className="comment-author">
                                        {getAuthorDisplayName(comment)}
                                    </span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {editingComment === comment._id ? (
                                    <div className="edit-comment-form">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="edit-textarea"
                                            rows={3}
                                            aria-label="Edit comment"
                                        />
                                        <div className="edit-actions">
                                            <button
                                                onClick={() => handleEdit(comment._id)}
                                                className="save-btn"
                                                disabled={!editContent.trim()}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingComment(null);
                                                    setEditContent('');
                                                }}
                                                className="cancel-btn"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="comment-content">{comment.content}</p>
                                        {isCommentOwner(comment) && (
                                            <div className="comment-actions">
                                                <button
                                                    onClick={() => {
                                                        setEditingComment(comment._id);
                                                        setEditContent(comment.content);
                                                    }}
                                                    className="edit-btn"
                                                    title="Edit comment"
                                                    aria-label={`Edit comment: ${comment.content.substring(0, 30)}...`}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="delete-btn"
                                                    title="Delete comment"
                                                    aria-label={`Delete comment: ${comment.content.substring(0, 30)}...`}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default Comments
