import { useState } from 'react';
import * as profileService from '../../services/profileService';

const AvatarUpload = ({ user, onAvatarUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        try {
          const updatedUser = await profileService.uploadAvatar(reader.result);
          onAvatarUpdate(updatedUser.avatar);
        } catch (err) {
          setError('Failed to upload avatar');
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      setError('Failed to process image');
      setLoading(false);
    }
  };


  
  return (
    <div className="avatar-upload">
      <label>
        {loading ? (
          'Uploading...'
        ) : (
          <>
            Change Avatar
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </>
        )}
      </label>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AvatarUpload;