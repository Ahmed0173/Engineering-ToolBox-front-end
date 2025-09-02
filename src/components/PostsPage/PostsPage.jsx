import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import * as postService from '../../services/postService';
import { getUser } from '../../services/authService';
import Comments from '../Comments/Comments';
import PrivateChatModal from './PrivateChatModal';
import DeletePostModal from '../PostDetails/DeletePostModal';
import './PostsPage.scss';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [savedPosts, setSavedPosts] = useState(new Set());
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const mine = params.get('mine') === '1';
    const liked = params.get('liked') === '1';
    const saved = params.get('saved') === '1';

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        // If we need user data for filtering but don't have it yet, wait
        if ((mine || liked || saved) && !user) {
            return;
        }
        fetchPosts();
    }, [mine, liked, saved, user]);

    const fetchPosts = async (page = 1, append = false) => {
        try {
            if (!append) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            let newPosts = [];
            if (mine && user?._id) {
                // My posts
                const filters = { author: user._id, page, limit: 10 };
                const postsData = await postService.getAllPosts(filters);
                newPosts = Array.isArray(postsData) ? postsData : [];
            } else if (liked && user?._id) {
                // Liked posts
                const postsData = await postService.getLikedPosts();
                newPosts = Array.isArray(postsData) ? postsData : [];
            } else if (saved && user?._id) {
                // Favorite (saved) posts
                const postsData = await postService.getSavedPosts();
                newPosts = Array.isArray(postsData) ? postsData : [];
            } else {
                // All posts
                const filters = { page, limit: 10 };
                const postsData = await postService.getAllPosts(filters);
                newPosts = Array.isArray(postsData) ? postsData : [];
            }

            if (append) {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
            } else {
                setPosts(newPosts);
                setCurrentPage(1);
            }

            setHasMorePosts(newPosts.length === 10);

            // Track which posts are saved by the current user
            if (user?._id && Array.isArray(newPosts)) {
                const userSavedPosts = new Set(savedPosts);
                newPosts.forEach(post => {
                    // For saved posts, all returned posts are saved
                    if (saved) {
                        userSavedPosts.add(post._id);
                    } else if (post.savedBy && Array.isArray(post.savedBy)) {
                        const isSaved = post.savedBy.some(savedUser =>
                            (typeof savedUser === 'object' && savedUser._id === user._id) ||
                            (typeof savedUser === 'string' && savedUser === user._id)
                        );
                        if (isSaved) {
                            userSavedPosts.add(post._id);
                        }
                    }
                });
                setSavedPosts(userSavedPosts);
            }
        } catch (err) {
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMorePosts = async () => {
        if (!hasMorePosts || loadingMore) return;
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        await fetchPosts(nextPage, true);
    };

    const handleLike = async (postId) => {
        if (!user) {
            alert('Please sign in to like posts');
            return;
        }

        try {
            const updatedPost = await postService.likePost(postId);
            setPosts(posts.map(post => (post._id === postId ? updatedPost : post)));
        } catch (err) {
            console.error('Error liking post:', err);
            const errorMessage = err.message || 'Failed to like post. Please try again.';
            alert(errorMessage);
        }
    };

    const handleSave = async (postId) => {
        if (!user) {
            alert('Please sign in to save posts');
            return;
        }

        try {
            await postService.savePost(postId);

            // Toggle the saved state locally
            setSavedPosts(prev => {
                const newSavedPosts = new Set(prev);
                if (newSavedPosts.has(postId)) {
                    newSavedPosts.delete(postId);
                } else {
                    newSavedPosts.add(postId);
                }
                return newSavedPosts;
            });

        } catch (err) {
            console.error('Error saving post:', err);
            const errorMessage = err.message || 'Failed to save post. Please try again.';
            alert(errorMessage);
        }
    };

    const handleDeleteClick = (post, e) => {
        e.stopPropagation(); // Prevent card click
        setPostToDelete(post);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        try {
            setLoading(true); // Show loading state during deletion
            await postService.deletePost(postToDelete._id);
            setPosts(posts.filter(post => post._id !== postToDelete._id));
            setShowDeleteModal(false);
            setPostToDelete(null);
            // Success feedback could be added here if desired
        } catch (err) {
            console.error('Error deleting post:', err);
            // More specific error messages
            const errorMessage = err.message || 'Failed to delete post. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setPostToDelete(null);
    };

    const handleStartChat = () => {
        if (!selectedUser) return;

        // Create a clean user object with only the necessary data for navigation
        const cleanUserData = {
            _id: selectedUser._id,
            username: selectedUser.username,
            email: selectedUser.email
        };

        // Navigate to chat page with the clean user data
        navigate(`/chats`, { state: { selectedUser: cleanUserData } });
        setShowChatModal(false);
        setSelectedUser(null);
    };

    const handleCloseModal = () => {
        setShowChatModal(false);
        setSelectedUser(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isUserPost = (post) => {
        return user && post.author && post.author._id === user._id;
    };

    const handleAuthorClick = (author, e) => {
        e.stopPropagation(); // Prevent card click
        if (author && user && author._id !== user._id) {
            setSelectedUser(author);
            setShowChatModal(true);
        }
    };

    const handleEditClick = (post, e) => {
        e.stopPropagation(); // Prevent card click
        // Navigate to edit form with post ID
        navigate(`/posts/${post._id}/edit`);
    };

    const handleLikeClick = (postId, e) => {
        e.stopPropagation(); // Prevent card click
        handleLike(postId);
    };

    const handleSaveClick = (postId, e) => {
        e.stopPropagation(); // Prevent card click
        handleSave(postId);
    };

    const handleCardClick = (postId) => {
        navigate(`/posts/${postId}`);
    };

    const isPostLiked = (post) => {
        if (!user || !post.likes) return false;
        return Array.isArray(post.likes)
            ? post.likes.some(like => like._id === user._id || like === user._id)
            : false;
    };

    const isPostSaved = (postId) => {
        return savedPosts.has(postId);
    };

    if (loading) return <div className="loading">Loading posts...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="posts-page">
            <div className="posts-header">
                <h1>{mine ? 'Your Posts' : liked ? 'Liked Posts' : saved ? 'Favourite Posts' : 'Engineering ToolBox Posts'}</h1>
                <p>Share your engineering knowledge and discoveries</p>
            </div>

            {user && <Link to="/PostForm" className="create-post-btn">Create Post</Link>}

            {posts.length === 0 ? (
                <div className="no-posts">
                    <h3>No posts yet</h3>
                    <p>Be the first to share something!</p>
                </div>
            ) : (
                <div className="posts-container">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="post-card clickable-card"
                            onClick={() => handleCardClick(post._id)}
                        >
                            <div className="post-header">
                                <div className="post-author">
                                    <span
                                        className="author-name clickable"
                                        onClick={(e) => handleAuthorClick(post.author, e)}
                                        style={{
                                            cursor: post.author && user && post.author._id !== user._id ? 'pointer' : 'default',
                                            color: '#0077cc',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        @{post.author?.username || 'Unknown'}
                                    </span>
                                    <span className="post-date">{formatDate(post.createdAt)}</span>
                                </div>
                                {isUserPost(post) && (
                                    <div className="post-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={(e) => handleEditClick(post, e)}
                                            title="Edit post"
                                            aria-label={`Edit post: ${post.content.substring(0, 50)}...`}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => handleDeleteClick(post, e)}
                                            title="Delete post"
                                            aria-label={`Delete post: ${post.content.substring(0, 50)}...`}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="post-content">
                                <p>{post.content}</p>
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="post-tags">
                                    {post.tags.map((tag, idx) => (
                                        <span key={idx} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="post-footer">
                                <div className="post-stats">
                                    <button
                                        className={`like-btn ${isPostLiked(post) ? 'liked' : ''}`}
                                        onClick={(e) => handleLikeClick(post._id, e)}
                                    >
                                        ❤️ {post.likes_count ?? (Array.isArray(post.likes) ? post.likes.length : 0)}
                                    </button>

                                    <button
                                        className={`save-btn ${isPostSaved(post._id) ? 'saved' : ''}`}
                                        onClick={(e) => handleSaveClick(post._id, e)}
                                        title={isPostSaved(post._id) ? 'Remove from saved' : 'Save post'}
                                    >
                                        {isPostSaved(post._id) ? '🔖 Saved' : '🔖 Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {hasMorePosts && (
                        <div className="load-more-container">
                            <button
                                className="load-more-btn"
                                onClick={loadMorePosts}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : 'Load More Posts'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showChatModal && selectedUser && (
                <PrivateChatModal
                    user={selectedUser}
                    onStartChat={handleStartChat}
                    onClose={handleCloseModal}
                />
            )}

            {showDeleteModal && postToDelete && (
                <DeletePostModal
                    post={postToDelete}
                    onConfirmDelete={handleConfirmDelete}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </div>
    );
};

export default PostsPage;
