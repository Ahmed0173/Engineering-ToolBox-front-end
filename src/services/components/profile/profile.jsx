import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loading/loader';
import * as profileService from '../../services/profileService';
import * as itemService from '../../services/itemService';
import AvatarUpload from '../AvatarUpload/AvatarUpload';
import './Profile.scss';

const Profile = ({ user, handleDeleteItem }) => {
  const [profileData, setProfileData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    contactInfo: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile();
        setProfileData(data.user);
        setUserItems(data.items);
        setFormData({
          bio: data.user.bio || '',
          location: data.user.location || '',
          contactInfo: data.user.contactInfo || ''
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = await profileService.updateProfile(formData);
      setProfileData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  if (loading) return <Loader />;
  if (!user) return <p className="auth-message">Please sign in to view your profile</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!profileData) return <p className="loading-message">Loading profile...</p>;

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={profileData.avatar} 
              alt={`${user.username}'s avatar`}
              className="profile-avatar"
            />
            <AvatarUpload 
              user={user} 
              onAvatarUpdate={(newAvatar) => {
                setProfileData({...profileData, avatar: newAvatar});
              }}
            />
          </div>
          
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p className="member-since">
              Member since: {new Date(profileData.createdAt).toLocaleDateString()}
            </p>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    maxLength="500"
                    placeholder="Tell others about yourself..."
                  />
                  <small>{500 - formData.bio.length} characters remaining</small>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactInfo">Contact Information</label>
                  <input
                    id="contactInfo"
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Email or phone number"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                {profileData.bio && <p className="bio">{profileData.bio}</p>}
                <div className="profile-meta">
                  {profileData.location && (
                    <p className="location">
                      <span className="icon">📍</span> {profileData.location}
                    </p>
                  )}
                  {profileData.contactInfo && (
                    <p className="contact">
                      <span className="icon">📧</span> {profileData.contactInfo}
                    </p>
                  )}
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="user-listings">
        <h2>My Listings <span className="count-badge">{userItems.length}</span></h2>
        
        {userItems.length === 0 ? (
          <div className="empty-state">
            <p>You haven't listed any items yet.</p>
            <button 
              className="primary-btn"
              onClick={() => navigate('/items/new')}
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {userItems.map((item) => (
              <div 
                key={item._id} 
                className="item-card"
                onClick={() => handleItemClick(item._id)}
              >
                {item.images && (
                  <div className="item-image">
                    <img src={item.images} alt={item.title} />
                  </div>
                )}
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="price">{item.price} BDH</p>
                  <div className="item-meta">
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                    <span className="condition">{item.condition}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button 
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/items/${item._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;