const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const mine = params.get('mine') === '1';
  const liked = params.get('liked') === '1';
  const saved = params.get('saved') === '1';

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    fetchPosts();
  }, [user, mine, liked, saved]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (mine && user?._id) filters.author = user._id;
      if (liked && user?._id) filters.likedBy = user._id;
      if (saved && user?._id) filters.savedBy = user._id;

      const postsData = await getAllPosts(filters);
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
      setPosts(posts.map(post => (post._id === postId ? updatedPost : post)));
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
      alert('Post saved/unsaved successfully');
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete._id);
      setPosts(posts.filter(post => post._id !== postToDelete._id));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                    <button className="delete-btn" onClick={() => handleDeleteClick(post)}>🗑️</button>
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
