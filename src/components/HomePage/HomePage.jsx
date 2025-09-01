import { Link } from "react-router-dom";
import "./HomePage.scss";

const HomePage = ({ user }) => {
    return (
        <main>
            {user ? (
                <>
                    <section className="home-welcome">
                        <h1 className="home-header">Welcome back, {user.username}!</h1>
                        <p className="home-subheader">Ready to solve some engineering challenges today?</p>
                        <div className="home-quick-actions">
                            <Link to="/posts" className="home-action-btn">
                                Browse Posts
                            </Link>
                            <Link to="/calculator" className="home-action-btn">
                                Calculator
                            </Link>
                            <Link to="/posts" className="home-action-btn">
                                Discussions
                            </Link>
                            <Link to="/chats" className="home-action-btn">
                                Private Chats
                            </Link>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    <section className="home-hero">
                        <div className="home-hero-text">
                            <h1 className="home-hero-text-heading">
                                Engineering Excellence,
                                <br />
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
