import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPostById, likePost, savePost, deletePost } from '../../services/postService'
import { getUser } from '../../services/authService'

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

    useEffect(() => { setUser(getUser()) }, [])

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

    const handleDelete = async () => {
        if (!user || !isOwner || !post) return
        if (!window.confirm('Delete this post?')) return
        try { setBusy(true); await deletePost(post._id); navigate('/posts') } finally { setBusy(false) }
    }

    if (loading) return <div className="post-details loading">Loading...</div>
    if (error) return <div className="post-details error">{error}</div>
    if (!post) return <div className="post-details">Post not found.</div>

    return (
        <div className="post-details">
            <div className="pd-topbar">
                <Link to="/posts" className="back-link">← Back to Posts</Link>
            </div>

            <article className="pd-card">
                <header className="pd-header">
                    <div className="pd-author">
                        <div className="pd-author-name">@{post.author?.username || 'Unknown'}</div>
                        <div className="pd-date">{formatDate(post.createdAt)}</div>
                    </div>

                    {isOwner && (
                        <div className="pd-actions">
                            <button className="pd-delete" onClick={handleDelete} disabled={busy || loading} title="Delete post">🗑️</button>
                        </div>
                    )}
                </header>

                <section className="pd-content">
                    <p>{post.content || 'No content available.'}</p>
                </section>

                {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <section className="pd-tags">
                        {post.tags.map((t, i) => <span key={i} className="tag">#{t}</span>)}
                    </section>
                )}

                <footer className="pd-footer">
                    <button className={`pd-like ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={busy || loading}>❤️ {likeCount(post)}</button>
                    <button className="pd-save" onClick={handleSave} disabled={busy || loading}>🔖 Save</button>
                </footer>
            </article>
        </div>
    )
}
