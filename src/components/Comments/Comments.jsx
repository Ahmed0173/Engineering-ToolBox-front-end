import React, { useState, useEffect } from 'react'
import {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
    replyToComment
} from '../../services/commentService'
import './Comments.scss'

const Comments = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [editingComment, setEditingComment] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    React.useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        try {
            setLoading(true)
            const fetchedComments = await getCommentsByPostId(postId)
            setComments(fetchedComments)
        } catch (err) {
            console.error('Error fetching comments:', err)
            setError('Failed to load comments')
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
        // Pass content as a string directly
        const comment = await createComment(postId, trimmedComment)
        setComments(prev => [...prev, comment])
        setNewComment('')
        setError('')
    } catch (err) {
        console.error('Error posting comment:', err)
        setError('Failed to post comment')
    }
}

    const handleEdit = async (commentId) => {
        if (!editContent.trim()) return
        
        try {
            const updatedComment = await updateComment(postId, commentId, { 
                content: editContent 
            })
            setComments(comments.map(c => 
                c._id === commentId ? updatedComment : c
            ))
            setEditingComment(null)
            setEditContent('')
        } catch (err) {
            console.error('Error editing comment:', err)
            setError('Failed to edit comment')
        }
    }

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return

        try {
            await deleteComment(postId, commentId)
            setComments(comments.filter(c => c._id !== commentId))
        } catch (err) {
            console.error('Error deleting comment:', err)
            setError('Failed to delete comment')
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
                />
                {error && <p className="error-message">{error}</p>}
                <button 
                    type="submit" 
                    disabled={!currentUser || !newComment.trim()}
                >
                    Post Comment
                </button>
            </form>

            {loading ? (
                <div className="loading">Loading comments...</div>
            ) : (
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">
                                    {comment.author?.username || 'Anonymous'}
                                </span>
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {editingComment === comment._id ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    handleEdit(comment._id)
                                }} className="edit-form">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        required
                                    />
                                    <div className="button-group">
                                        <button type="submit">Save</button>
                                        <button 
                                            type="button" 
                                            onClick={() => setEditingComment(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="comment-content">{comment.content}</p>
                            )}

                            {currentUser && currentUser._id === comment.author?._id && (
                                <div className="comment-actions">
                                    <button
                                        onClick={() => {
                                            setEditingComment(comment._id)
                                            setEditContent(comment.content)
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(comment._id)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comments