import { Link } from 'react-router-dom';
import './Homepage.scss';
import IMAGES from '../../images'

const Homepage = ({ user, items }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': '📱',
      'Furniture & Home': '🪑',
      'Wearables': '👕',
      'Books': '📚',
      'Sports': '⚽',
      'Hobbies': '🎨',
      'Spare Parts': '⚙️',
      'Toys': '🧸',
      'Vehicles': '🚗',
      'Other': '✨'
    };
    return icons[category] || '✨';
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to SecondHand</h1>
          <p className="tagline">Find hidden treasures in your community</p>
          <div className="hero-buttons">
            <Link to="/items" className="vintage-button primary">
              Browse Items
            </Link>
            {user ? (
              <Link to="/items/new" className="vintage-button secondary">
                Sell an Item
              </Link>
            ) : (
              <Link to="/sign-up" className="vintage-button secondary">
                Join Now
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
             <img 
                src={IMAGES.hero}
                alt="Women shopping illustration"
                className="hero-illustration"
                /> 
        
          </div>
        </div>
      </div>

      <div className="featured-categories">
        <h2>Popular Categories</h2>
        <div className="category-grid">
          {['Electronics', 'Furniture & Home', 'Wearables', 'Books'].map(category => (
            <Link 
              to={`/items?category=${category}`} 
              key={category} 
              className="category-card"
            >
              <div className="category-icon">
                {getCategoryIcon(category)}
              </div>
              <h3>{category}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="recent-items">
  <div className="section-header">
    <h2>Recently Added</h2>
    <Link to="/items" className="view-all">View All →</Link>
  </div>
  {items.slice(0, 2).length > 0 ? ( 
    <div className="item-grid">
      {items.slice(0, 2).map(item => ( 
        <Link to={`/items/${item._id}`} key={item._id} className="item-card">
          <div className="item-image">
            {item.images ? (
              <img src={item.images} alt={item.title} />
            ) : (
              <div className="image-placeholder">https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9gUXKwt2KErC_jWWlkZkGabxpeGchT-fyw&s</div>
            )}
          </div>
          <div className="item-details">
            <h3>{item.title}</h3>
            <p className="item-price">{item.price} BDH</p>
            <p className="item-status">{item.status}</p>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p className="no-items">No items available yet</p>
  )}
</div>

    </div>
  );
};

export default Homepage;