import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.scss";

const HomePage = ({ user }) => {
    const [recentPosts, setRecentPosts] = useState([]);
    const [userStats, setUserStats] = useState({
        postsCount: 0,
        commentsCount: 0,
        likesReceived: 0
    });

    // Mock data for demonstration - replace with actual API calls
    useEffect(() => {
        if (user) {
            // Simulate fetching recent posts
            setRecentPosts([
                {
                    _id: '1',
                    content: 'How to calculate beam deflection in steel structures?',
                    author: { username: 'EngineerMike' },
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    likes_count: 12,
                    tags: ['structural', 'steel']
                },
                {
                    _id: '2',
                    content: 'Best practices for HVAC system design in commercial buildings',
                    author: { username: 'HVACExpert' },
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                    likes_count: 8,
                    tags: ['hvac', 'commercial']
                },
                {
                    _id: '3',
                    content: 'Circuit analysis for complex electrical networks',
                    author: { username: 'ElectricalGuru' },
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    likes_count: 15,
                    tags: ['electrical', 'circuits']
                }
            ]);

            // Simulate user stats
            setUserStats({
                postsCount: Math.floor(Math.random() * 20) + 5,
                commentsCount: Math.floor(Math.random() * 50) + 10,
                likesReceived: Math.floor(Math.random() * 100) + 25
            });
        }
    }, [user]);

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
    };

    return (
        <main>
            {user ? (
                <>
                    {/* Welcome Section */}
                    <section className="home-welcome">
                        <h1 className="home-header">Welcome back, {user.username}!</h1>
                        <p className="home-subheader">Ready to solve some engineering challenges today?</p>
                        <div className="home-quick-actions">
                            <Link to="/posts/new" className="home-action-btn primary">
                                ✏️ Create Post
                            </Link>
                            <Link to="/posts" className="home-action-btn">
                                💬 Browse Posts
                            </Link>
                            <Link to="/calculator" className="home-action-btn">
                                🧮 Calculator
                            </Link>
                        </div>
                    </section>

                    {/* Dashboard Grid */}
                    <div className="home-dashboard">
                        {/* User Stats */}
                        <section className="dashboard-section stats-section">
                            <h2 className="section-title">Your Activity</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📄</div>
                                    <div className="stat-info">
                                        <span className="stat-number">{userStats.postsCount}</span>
                                        <span className="stat-label">Posts Created</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💬</div>
                                    <div className="stat-info">
                                        <span className="stat-number">{userStats.commentsCount}</span>
                                        <span className="stat-label">Comments</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">❤️</div>
                                    <div className="stat-info">
                                        <span className="stat-number">{userStats.likesReceived}</span>
                                        <span className="stat-label">Likes Received</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Tools */}
                        <section className="dashboard-section tools-section">
                            <h2 className="section-title">Quick Tools</h2>
                            <div className="tools-grid">
                                <Link to="/calculator" className="tool-card">
                                    <div className="tool-icon">🧮</div>
                                    <h3>Basic Calculator</h3>
                                    <p>Perform quick calculations</p>
                                </Link>
                                <Link to="/calculator/formula" className="tool-card">
                                    <div className="tool-icon">📐</div>
                                    <h3>Formula Calculator</h3>
                                    <p>Engineering formulas</p>
                                </Link>
                                <Link to="/chats" className="tool-card">
                                    <div className="tool-icon">💬</div>
                                    <h3>Private Chats</h3>
                                    <p>Connect with engineers</p>
                                </Link>
                                <Link to="/posts?saved=1" className="tool-card">
                                    <div className="tool-icon">🔖</div>
                                    <h3>Saved Posts</h3>
                                    <p>Your bookmarks</p>
                                </Link>
                            </div>
                        </section>

                        {/* Recent Community Activity */}
                        <section className="dashboard-section recent-posts-section">
                            <div className="section-header">
                                <h2 className="section-title">Recent Community Posts</h2>
                                <Link to="/posts" className="view-all-link">View All →</Link>
                            </div>
                            <div className="recent-posts">
                                {recentPosts.map(post => (
                                    <Link to={`/posts/${post._id}`} key={post._id} className="post-preview">
                                        <div className="post-content">
                                            <h4>{post.content}</h4>
                                            <div className="post-meta">
                                                <span className="post-author">@{post.author.username}</span>
                                                <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                                                <span className="post-likes">❤️ {post.likes_count}</span>
                                            </div>
                                            {post.tags && (
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
                        </section>

                        {/* Engineering Tips */}
                        <section className="dashboard-section tips-section">
                            <h2 className="section-title">Daily Engineering Tip</h2>
                            <div className="tip-card">
                                <div className="tip-icon">💡</div>
                                <div className="tip-content">
                                    <h3>Factor of Safety</h3>
                                    <p>Always apply appropriate safety factors in structural design. For static loads, use 1.5-2.0, and for dynamic loads, consider 3.0-4.0 depending on the application and material properties.</p>
                                </div>
                            </div>
                        </section>


                    </div>
                </>
            ) : (
                <>
                    <section className="home-hero">
                        <div className="home-hero-text">
                            <h1 className="home-hero-text-heading">
                                Engineering Excellence,

                                One Calculation at a Time.
                            </h1>
                            <div className="home-hero-text-subheading">
                                <p className="home-hero-text-subheading-para">
                                    Engineering ToolBox is your comprehensive platform for engineering calculations,
                                    formulas, and community knowledge sharing. Connect with fellow engineers,
                                    share solutions, and access powerful calculation tools.
                                </p>
                                <p className="home-hero-text-subheading-para">
                                    Ready to elevate your engineering work?
                                </p>
                            </div>
                            <div className="home-hero-text-cta">
                                <div className="home-hero-text-cta-btns">
                                    <Link
                                        className="home-hero-text-cta-btns-btnlink"
                                        to={"/auth/signin"}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        className="home-hero-text-cta-btns-btnlink home-hero-text-cta-btns-signuplink"
                                        to={"/auth/signup"}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                                <div className="home-hero-text-cta-link">
                                    Want to explore first? <a href="#home-features">See what we offer</a>.
                                </div>
                            </div>
                        </div>
                        <figure className="home-hero-imagefigure">
                            <div className="home-hero-placeholder">
                                <span className="home-hero-icon">⚙️</span>
                                <span className="home-hero-icon">📐</span>
                                <span className="home-hero-icon">🔧</span>
                            </div>
                        </figure>
                    </section>

                    <section id="home-features" className="home-features">
                        <div className="home-features-text">
                            <h2 className="home-features-text-heading">What You Can Do</h2>
                            <div className="home-features-grid">
                                <div className="home-feature-card">
                                    <h3>🧮 Advanced Calculators</h3>
                                    <p>Access powerful engineering calculators for complex calculations and formula-based computations.</p>
                                </div>
                                <div className="home-feature-card">
                                    <h3>📋 Share Knowledge</h3>
                                    <p>Create posts to share engineering insights, ask questions, and collaborate with the community.</p>
                                </div>
                                <div className="home-feature-card">
                                    <h3>💬 Private Messaging</h3>
                                    <p>Connect directly with other engineers through private chats for detailed discussions.</p>
                                </div>
                                <div className="home-feature-card">
                                    <h3>📚 Formula Library</h3>
                                    <p>Browse and utilize a comprehensive library of engineering formulas and calculations.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="home-process">
                        <div className="home-process-text">
                            <h2 className="home-process-text-heading">How It Works</h2>
                            <div className="home-process-steps">
                                <div className="home-process-step">
                                    <div className="home-process-step-number">1</div>
                                    <p>Create an account to access all features and save your work</p>
                                </div>
                                <div className="home-process-step">
                                    <div className="home-process-step-number">2</div>
                                    <p>Use our calculators for engineering calculations and formula evaluations</p>
                                </div>
                                <div className="home-process-step">
                                    <div className="home-process-step-number">3</div>
                                    <p>Share your knowledge by creating posts and engaging with the community</p>
                                </div>
                                <div className="home-process-step">
                                    <div className="home-process-step-number">4</div>
                                    <p>Connect with fellow engineers through comments and private messages</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="home-testimonials">
                        <h2 className="home-testimonials-heading">What Engineers Are Saying</h2>
                        <div className="home-testimonials-list">
                            <blockquote className="home-testimonial">
                                "The calculator tools saved me hours on my structural analysis project.
                                The community feedback was invaluable!"
                                <cite>— Sarah M., Structural Engineer</cite>
                            </blockquote>
                            <blockquote className="home-testimonial">
                                "Finally, a platform where I can share my mechanical engineering insights
                                and learn from others. The formula library is comprehensive!"
                                <cite>— Ahmed K., Mechanical Engineer</cite>
                            </blockquote>
                            <blockquote className="home-testimonial">
                                "The private messaging feature helped me collaborate on a complex project.
                                This platform brings engineers together effectively."
                                <cite>— Lisa R., Electrical Engineer</cite>
                            </blockquote>
                        </div>
                        <p className="home-testimonials-para">
                            Join 5,000+ professional engineers advancing their careers with Engineering ToolBox.
                        </p>
                    </section>
                </>
            )}
        </main>
    );
};

export default HomePage;
