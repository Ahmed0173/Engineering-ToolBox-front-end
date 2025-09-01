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
        if (comment.author && typeof comment.author === 'object' && comment.author.username) {
            return comment.author.username
        }
        if (comment.username) {
            return comment.username
        }
        if (comment.author && typeof comment.author === 'object') {
            if (comment.author.name) {
                return comment.author.name
            }
            if (comment.author.displayName) {
                return comment.author.displayName
            }
        }
        if (currentUser && currentUser.username &&
            (comment.author === currentUser._id || 
             comment.author === currentUser.id ||
             (typeof comment.author === 'string' && comment.author === currentUser._id))) {
            return currentUser.username
        }
        if (currentUser && currentUser.username) {
            const possibleUserIds = [currentUser._id, currentUser.id, currentUser.userId]
            const commentAuthorId = typeof comment.author === 'object' ? 
                (comment.author._id || comment.author.id || comment.author.userId) : comment.author
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
        if (comment.author && typeof comment.author === 'object') {
            return comment.author._id === currentUser._id
        }
        if (typeof comment.author === 'string') {
            return comment.author === currentUser._id
        }
        return false
    }

    useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        try {
            setLoading(true)
            const fetchedComments = await getCommentsByPostId(postId)
            setComments(fetchedComments)
        } catch (err) {
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


    // Add this function with your other handlers
const handleReply = async (commentId) => {
    if (!replyContent.trim()) return
    
    try {
        await replyToComment(postId, commentId, { 
            content: replyContent,
            author: currentUser._id,
            username: currentUser.username
        })
        await fetchComments() // Refresh to get updated replies
        setReplyingTo(null)
        setReplyContent('')
    } catch (err) {
        console.error('Error posting reply:', err)
        setError('Failed to post reply')
    }
}

    const trimmedComment = newComment.trim()
    if (!trimmedComment) {
        setError('Comment cannot be empty')
        return
    }

        try {
            const commentData = {
                content: trimmedComment,
                author: currentUser._id || currentUser.id,
                username: currentUser.username, // Include as fallback
                authorName: currentUser.username, // Additional fallback
                authorUsername: currentUser.username // Another fallback
            }
            await createComment(postId, commentData)
            await fetchComments()
            setNewComment('')
            setError('')
        } catch (err) {
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
            setError('Failed to edit comment')
        }
    }

      const handleAddComment = async (commentData) => {
    try {
      const newComment = await itemService.createComment(commentData, itemId);
      setItem((prevItem) => ({
        ...prevItem,
        comments: [...prevItem.comments, newComment],
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await itemService.deleteItem(itemId);
      navigate("/items");
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return

        try {
            await deleteComment(postId, commentId)
            setComments(comments.filter(c => c._id !== commentId))
        } catch (err) {
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
                                {getAuthorDisplayName(comment)}
                            </span>
                            <span className="comment-date">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                        {/* <button>edt comment</button> */}

                            <div className="comment-actions">
                                <button onClick={() => handleDelete(comment._id)}>
                                    Delete
                                </button>
                                <button onClick={() => {
                                    setEditingComment(comment._id);
                                    setEditContent(comment.content);
                                }}>
                                    Edit
                                </button>
                            </div>
                        
                    </div>
                ))}
            </div>
        )}
    </div>
)
}

export default Comments
