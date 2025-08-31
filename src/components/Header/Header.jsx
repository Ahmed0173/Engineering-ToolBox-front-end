import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.scss';

const NavBar = ({ user, handleSignOut }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const onSignOut = (e) => {
        e.preventDefault();
        handleSignOut?.();
        navigate('/');
    };

    const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;
    const closeMenu = () => setOpen(false);

    const initial = (user?.username || user?.email || 'U').trim()[0]?.toUpperCase();

    return (
        <header className="navbar">
            <div className="nav-inner">
                {/* LEFT: avatar + brand */}
                <div className="nav-left">
                    {user && (
                        <Link to="/profile" className="avatar-link" aria-label="Profile" onClick={closeMenu}>
                            {user.avatar
                                ? <img src={user.avatar} alt="" className="avatar-img" />
                                : <span className="avatar-dot">{initial}</span>}
                        </Link>
                    )}
                    <Link to="/" className="brand">Engineering Toolbox</Link>
                </div>

                {/* mobile toggle */}
                <button
                    className="menu-toggle"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen(v => !v)}
                >
                    ☰
                </button>

                {/* RIGHT: links */}
                <div className={`nav-right ${open ? 'open' : ''}`}>
                    <NavLink to="/posts" className={linkClass} onClick={closeMenu}>
                        Posts
                    </NavLink>

                    {user ? (
                        <>
                            <NavLink to="/chats" className={linkClass} onClick={closeMenu}>
                                Chats
                            </NavLink>

                            <Link to="/" onClick={onSignOut} className="nav-cta">Sign Out</Link>
                        </>
                    ) : (
                        <>
                            <NavLink to="/signin" className={linkClass} onClick={closeMenu}>Sign In</NavLink>
                            <NavLink to="/signup" className={linkClass} onClick={closeMenu}>Sign Up</NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar;
