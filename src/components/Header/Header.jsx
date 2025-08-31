import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.scss';

const NavBar = ({ user, handleSignOut }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onSignOut = (e) => {
    e.preventDefault();
    if (handleSignOut) handleSignOut();
    navigate('/signin');
  };

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active' : ''}`;

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
          <NavLink to="/posts" className={linkClass}>
            Posts
          </NavLink>

          {user ? (
            <>
              <NavLink to="/PostForm" className={linkClass}>Make a post</NavLink>
              <span className="nav-user">Hi, {user.username}</span>
              <Link to="/" onClick={onSignOut} className="nav-cta">Sign Out</Link>
            </>
          ) : (
            <>
              <NavLink to="/signin" className="nav-cta">Sign In</NavLink>
              <NavLink to="/signup" className={linkClass}>Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
