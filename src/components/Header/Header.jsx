import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.scss';
// ❌ remove this — you don't render the component here
// import UserProfile from '../UserProfile/UserProfile';

const NavBar = ({ user, handleSignOut }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onSignOut = (e) => {
    e.preventDefault();
    if (handleSignOut) handleSignOut();
    navigate('/signin');
  };

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;
  const closeMenu = () => setOpen(false);

  // initial for the small avatar dot
  const initial = (user?.username || user?.email || 'U').trim()[0]?.toUpperCase();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">Engineering Toolbox</Link>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/posts" className={linkClass} onClick={closeMenu}>
            Posts
          </NavLink>

          {user ? (
            <>
              {/* ✅ NEW: Profile link */}
              <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
                <span className="nav-profile">
                  <span className="avatar-dot">{initial}</span>
                </span>
              </NavLink>

              <span className="nav-user">Hi, {user.username}</span>
              <Link to="/" onClick={onSignOut} className="nav-cta">Sign Out</Link>
            </>
          ) : (
            <>
              <NavLink to="/signin" className="nav-cta" onClick={closeMenu}>Sign In</NavLink>
              <NavLink to="/signup" className={linkClass} onClick={closeMenu}>Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
