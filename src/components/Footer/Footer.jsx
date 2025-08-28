import { Link } from 'react-router-dom';
import './Footer.scss'

const Footer = ({ user }) => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SecondHand</h3>
          <p>Your marketplace for buying and selling pre-loved items.</p>
          <div className="footer-links">
            {user ? (
              <Link to="/items/new" className="footer-link">Sell an Item</Link>
            ) : (
              <Link to="/sign-in" className="footer-link">Start Selling</Link>
            )}
          </div>
        </div>

        <div className="footer-section">
          <h4>Explore</h4>
          <nav className="footer-nav">
            <Link to="/items" className="footer-link">Browse All</Link>
            <Link to="/" className="footer-link">Home</Link>
            {user && <Link to="/profile" className="footer-link">My Profile</Link>}
          </nav>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <div className="footer-auth-links">
            {user ? (
              <Link to="/" onClick={() => {
                localStorage.removeItem('token');
                window.location.reload(); 
              }} className="footer-link">
                Sign Out
              </Link>
            ) : (
              <>
                <Link to="/sign-in" className="footer-link">Sign In</Link>
                <Link to="/sign-up" className="footer-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;