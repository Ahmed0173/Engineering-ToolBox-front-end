import { Link } from 'react-router-dom'

const NavBar = (props) => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/items" className="nav-link">Items</Link>
        </li>

        
        {props.user ? (
          <>
            <li className="nav-item welcome">
              Welcome, <span className="username">{props.user.username}</span>
            </li>
            <li className="nav-item">
              <Link to="/items/new" className="nav-link">Post Item</Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li className="nav-item">
              <button 
                onClick={props.handleSignOut} 
                className="nav-button"
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/sign-up" className="nav-link">Sign Up</Link>
            </li>
            <li className="nav-item">
              <Link to="/sign-in" className="nav-link">Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar 