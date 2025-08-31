import React, { useState, useEffect } from 'react';
import { getAllPosts, likePost, savePost, deletePost } from '../../services/postService';
import { getUser } from '../../services/authService';
import { Link } from 'react-router-dom'
import './PostsPage.scss';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const postsData = await getAllPosts();
            console.log('Fetched posts:', postsData); // Debug log
            setPosts(Array.isArray(postsData) ? postsData : []);
        } catch (err) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        if (!user) {
            alert('Please sign in to like posts');
            return;
        }

        try {
            const updatedPost = await likePost(postId);
            setPosts(posts.map(post =>
                post._id === postId ? updatedPost : post
            ));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleSave = async (postId) => {
        if (!user) {
            alert('Please sign in to save posts');
            return;
        }

        try {
            await savePost(postId);
            // You might want to show a success message here
            alert('Post saved/unsaved successfully');
        } catch (err) {
            console.error('Error saving post:', err);
        }
    };

    const handleDelete = async (postId) => {
        if (!user) {
            alert('Please sign in to delete posts');
            return;
        }

        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(post => post._id !== postId));
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('Failed to delete post');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isUserPost = (post) => {
        return user && post.author && post.author._id === user._id;
    };

    const isPostLiked = (post) => {
        return user && post.likes && Array.isArray(post.likes) && post.likes.includes(user._id);
    };

    if (loading) return <div className="loading">Loading posts...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="posts-page">
            <div className="posts-header">
                <h1>Engineering ToolBox Posts</h1>
                <p>Share your engineering knowledge and discoveries</p>
            </div>

            {user && (
                <Link to="/PostForm" className="create-post-btn">Create Post</Link>
            )}

            {posts.length === 0 ? (
                <div className="no-posts">
                    <h3>No posts yet</h3>
                    <p>Be the first to share something!</p>
                </div>
            ) : (
                <div className="posts-container">
                    {posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <div className="post-header">
                                <div className="post-author">
                                    <span className="author-name">@{post.author?.username || 'Unknown'}</span>
                                    <span className="post-date">{formatDate(post.createdAt)}</span>
                                </div>
                                {isUserPost(post) && (
                                    <div className="post-actions">
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(post._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>

                            <Link to={`/posts/${post._id}`} className="post-link">
                                <div className="post-content">
                                    <p>{post.content}</p>
                                </div>

                                {post.tags && post.tags.length > 0 && (
                                    <div className="post-tags">
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="tag">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </Link>

                            {post.tags && post.tags.length > 0 && (
                                <div className="post-tags">
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="post-footer">
                                <div className="post-stats">
                                    <button
                                        className={`like-btn ${isPostLiked(post) ? 'liked' : ''}`}
                                        onClick={() => handleLike(post._id)}
                                    >
                                        ❤️ {post.likes_count || (post.likes ? post.likes.length : 0)}
                                    </button>

                                    <button
                                        className="save-btn"
                                        onClick={() => handleSave(post._id)}
                                    >
                                        🔖 Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostsPage;