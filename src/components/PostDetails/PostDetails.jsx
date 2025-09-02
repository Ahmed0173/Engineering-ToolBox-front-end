import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPostById, likePost, savePost, deletePost } from '../../services/postService'
import { getUser } from '../../services/authService'
import DeletePostModal from './DeletePostModal'
import Comments from '../Comments/Comments'
import './PostDetails.scss'

const sameId = (a, b) => {
    if (!a || !b) return false
    const as = typeof a === 'string' ? a : a._id || a.id
    const bs = typeof b === 'string' ? b : b._id || b.id
    return String(as) === String(bs)
}

const formatDate = (s) => {
    const d = new Date(s)
    return isNaN(d) ? '—' : d.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const likeCount = (post) =>
    typeof post?.likes_count === 'number' ? post.likes_count :
        Array.isArray(post?.likes) ? post.likes.length : 0

export default function PostDetails() {
    const { postId } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [busy, setBusy] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)


    useEffect(() => {
        const userData = getUser()
        console.log('User data in PostDetails:', userData)
        setUser(userData)
    }, [])

    useEffect(() => {
        let ignore = false
            ; (async () => {
                try {
                    setLoading(true); setError(null)
                    const data = await getPostById(postId)
                    if (!ignore) setPost(data)
                } catch (e) {
                    if (!ignore) setError('Failed to load post.')
                } finally {
                    if (!ignore) setLoading(false)
                }
            })()
        return () => { ignore = true }
    }, [postId])

    const isOwner = useMemo(() =>
        user && post?.author && sameId(post.author?._id, user?._id),
        [user, post])

    const isLiked = useMemo(() =>
        !!(user && Array.isArray(post?.likes) && post.likes.some(l => sameId(l, user?._id))),
        [user, post])

    const handleLike = async () => {
        if (!user || !post) return alert('Please sign in to like posts')
        try { setBusy(true); setPost(await likePost(post._id)) } finally { setBusy(false) }
    }

    const handleSave = async () => {
        if (!user || !post) return alert('Please sign in to save posts')
        try { setBusy(true); setPost(await savePost(post._id)) } finally { setBusy(false) }
    }

    const handleDeleteClick = () => {
        if (!user || !isOwner || !post) return
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        try {
            setBusy(true)
            await deletePost(post._id)
            setShowDeleteModal(false)
            navigate('/posts')
        } finally {
            setBusy(false)
        }
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
    }

    if (loading) return <div className="post-details loading">Loading...</div>
    if (error) return <div className="post-details error">{error}</div>
    if (!post) return <div className="post-details">Post not found.</div>

    return (
        <div className="post-details">
            <div className="pd-topbar">
                <Link to="/posts" className="back-link">← Back to Discussions</Link>
            </div>

            <div className="discussion-thread">
                Engineering Discussion Thread
            </div>

            <article className="pd-card">
                <header className="pd-header">
                    <div className="pd-author">
                        <div className="pd-author-avatar">
                            {post.author?.avatar ? (
                                <img src={post.author.avatar} alt={post.author.username} />
                            ) : (
                                <img src="https://cdn.pfps.gg/pfps/2301-default-2.png" alt={post.author?.username || 'User'} />
                            )}
                        </div>
                        <div className="pd-author-info">
                            <div className="pd-author-name">@{post.author?.username || 'Unknown'}</div>
                            <div className="pd-date">{formatDate(post.createdAt)}</div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="pd-actions">
                            <button className="pd-delete" onClick={handleDeleteClick} disabled={busy || loading} title="Delete post">
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </header>

                <section className="pd-content">
                    <p>{post.content || 'No content available.'}</p>
                </section>

                {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <section className="pd-tags">
                        {post.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
                    </section>
                )}

                <footer className="pd-footer">
                    <div className="engagement-stats">
                        <button className={`pd-like ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={busy || loading}>
                            ❤️ {isLiked ? 'Liked' : 'Like'} ({likeCount(post)})
                        </button>
                        <button className="pd-save" onClick={handleSave} disabled={busy || loading}>
                            🔖 Save for Later
                        </button>

                    </div>
                </footer>
            </article>

            <section className="pd-comments">
                <Comments postId={postId} currentUser={user} />
            </section>

            {showDeleteModal && (
                <DeletePostModal
                    post={post}
                    onConfirmDelete={handleConfirmDelete}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </div>
    )
}
