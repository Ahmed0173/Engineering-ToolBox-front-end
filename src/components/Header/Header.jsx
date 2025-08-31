import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.scss';

const NavBar = ({ user, handleSignOut }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onSignOut = (e) => {
    e.preventDefault();
    if (handleSignOut) handleSignOut();
    navigate('/sign-in');
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
          <NavLink to="/calculator" className={linkClass}>
            Basic Calculator
          </NavLink>
          <NavLink to="/calculation" className={linkClass}>
            Quick Calculator
          </NavLink>
          <NavLink to="/formulas" className={linkClass}>
            Formulas
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>

          {user ? (
            <>
              <span className="nav-user">Hi, {user.username}</span>
              <Link to="/" onClick={onSignOut} className="nav-cta">Sign Out</Link>
            </>
          ) : (
            <>
              <NavLink to="/sign-in" className="nav-cta">Sign In</NavLink>
              <NavLink to="/sign-up" className={linkClass}>Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
