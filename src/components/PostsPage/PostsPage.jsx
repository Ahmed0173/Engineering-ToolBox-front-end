// src/components/PostsPage/PostsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllPosts, likePost, savePost, deletePost } from '../../services/postService';
import { getUser } from '../../services/authService';
import './PostsPage.scss';
import PrivateChatModal from './PrivateChatModal';
import { startChat } from '../../services/chatService';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [user, setUser]     = useState(null);

  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUser, setSelectedUser]   = useState(null);

  const navigate = useNavigate();
  const [params] = useSearchParams();

  // URL filters: /posts?mine=1, /posts?liked=1, /posts?saved=1
  const mine  = params.get('mine')  === '1';
  const liked = params.get('liked') === '1';
  const saved = params.get('saved') === '1';

  // load user once
  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser || null);
  }, []);

  // fetch posts when user or filters change
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, mine, liked, saved]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (mine  && user?._id) filters.author  = user._id;
      if (liked && user?._id) filters.likedBy = user._id;
      if (saved && user?._id) filters.savedBy = user._id;

      const data = await getAllPosts(filters);
      setPosts(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return alert('Please sign in to like posts');
    try {
      const updatedPost = await likePost(postId);
      setPosts(prev => prev.map(p => (p._id === postId ? updatedPost : p)));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleSave = async (postId) => {
    if (!user) return alert('Please sign in to save posts');
    try {
      await savePost(postId);
      alert('Post saved/unsaved successfully');
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) return alert('Please sign in to delete posts');
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserPost  = (post) => user && post.author && post.author._id === user._id;
  const isPostLiked = (post) => user && Array.isArray(post.likes) && post.likes.includes(user._id);

  const handleAuthorClick = (author) => {
    if (author && user && author._id !== user._id) {
      setSelectedUser(author);
      setShowChatModal(true);
    }
  };

  const handleStartChat = async () => {
    try {
      const chat = await startChat(selectedUser._id);
      setShowChatModal(false);
      setSelectedUser(null);
      if (chat && chat._id) navigate(`/chats/${chat._id}`);
      else alert('Failed to start chat.');
    } catch (err) {
      alert('Error starting chat: ' + (err.message || err));
    }
  };

  const handleCloseModal = () => {
    setShowChatModal(false);
    setSelectedUser(null);
  };

  const title =
    mine  ? 'Your Posts' :
    liked ? 'Liked Posts' :
    saved ? 'Favourite Posts' : 'Engineering ToolBox Posts';

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="posts-page">
      <div className="posts-header">
        <h1>{title}</h1>
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
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <span
                    className="author-name clickable"
                    onClick={() => handleAuthorClick(post.author)}
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
                    <button className="delete-btn" onClick={() => handleDelete(post._id)}>🗑️</button>
                  </div>
                )}
              </div>

              <Link to={`/posts/${post._id}`} className="post-link">
                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </Link>

              <div className="post-footer">
                <div className="post-stats">
                  <button
                    className={`like-btn ${isPostLiked(post) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤️ {post.likes_count ?? (Array.isArray(post.likes) ? post.likes.length : 0)}
                  </button>

                  <button className="save-btn" onClick={() => handleSave(post._id)}>
                    🔖 Save
                  </button>
                </div>
              </div>
            </div>
          ))}

          {showChatModal && selectedUser && (
            <PrivateChatModal
              user={selectedUser}
              onStartChat={handleStartChat}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostsPage;
