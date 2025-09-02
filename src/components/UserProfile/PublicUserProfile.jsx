import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../../services/userService';
import './PublicUserProfile.scss';

const PublicUserProfile = () => {
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const profileData = await getUserProfile(userId);
                setUserProfile(profileData);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
    };

    if (loading) {
        return (
            <div className="public-profile-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="public-profile-container">
                <div className="error-state">
                    <h2>❌ {error}</h2>
                    <Link to="/posts" className="back-link">← Back to Posts</Link>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="public-profile-container">
                <div className="error-state">
                    <h2>User not found</h2>
                    <Link to="/posts" className="back-link">← Back to Posts</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="public-profile-container">
            <div className="profile-header">
                <Link to="/posts" className="back-link">← Back to Posts</Link>

                <div className="user-header">
                    <div className="user-avatar">
                        {userProfile.user.avatar ? (
                            <img src={userProfile.user.avatar} alt={userProfile.user.username} />
                        ) : (
                            <div className="avatar-placeholder">
                                {userProfile.user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h1>@{userProfile.user.username}</h1>
                        {userProfile.user.title && (
                            <p className="user-title">{userProfile.user.title}</p>
                        )}
                        <p className="join-date">
                            🗓️ Joined {formatDate(userProfile.user.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-main">
                    {userProfile.user.bio && (
                        <div className="profile-section user-bio">
                            <h3>About</h3>
                            <p>{userProfile.user.bio}</p>
                        </div>
                    )}

                    {userProfile.user.contactInfo && (
                        <div className="profile-section user-contact">
                            <h3>Contact Information</h3>
                            <p>{userProfile.user.contactInfo}</p>
                        </div>
                    )}

                    <div className="profile-section user-stats">
                        <h3>Activity Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📄</div>
                                <div className="stat-info">
                                    <span className="stat-number">{userProfile.stats.postsCount}</span>
                                    <span className="stat-label">Posts Created</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💬</div>
                                <div className="stat-info">
                                    <span className="stat-number">{userProfile.stats.commentsCount}</span>
                                    <span className="stat-label">Comments Made</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">❤️</div>
                                <div className="stat-info">
                                    <span className="stat-number">{userProfile.stats.likesReceived}</span>
                                    <span className="stat-label">Likes Received</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {userProfile.recentPosts && userProfile.recentPosts.length > 0 && (
                        <div className="profile-section recent-posts">
                            <div className="section-header">
                                <h3>Recent Posts</h3>
                                <Link to={`/posts?author=${userId}`} className="view-all-link">
                                    View All Posts →
                                </Link>
                            </div>
                            <div className="posts-list">
                                {userProfile.recentPosts.map(post => (
                                    <Link to={`/posts/${post._id}`} key={post._id} className="post-item">
                                        <div className="post-content">
                                            <p>{post.content}</p>
                                            <div className="post-meta">
                                                <span className="post-time">
                                                    {formatTimeAgo(post.createdAt)}
                                                </span>
                                                <span className="post-likes">
                                                    ❤️ {post.likes?.length || 0}
                                                </span>
                                            </div>
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="post-tags">
                                                    {post.tags.map(tag => (
                                                        <span key={tag} className="tag">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!userProfile.recentPosts || userProfile.recentPosts.length === 0) && (
                        <div className="profile-section no-posts">
                            <h3>Recent Posts</h3>
                            <p>This user hasn't created any posts yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicUserProfile;
