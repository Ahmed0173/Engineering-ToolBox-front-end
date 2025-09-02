const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (err) {
    console.error('Error fetching profile:', err);
    throw err;
  }
};

const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Validate required fields
    if (profileData.username && profileData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    
    if (profileData.bio && profileData.bio.length > 500) {
      throw new Error('Bio must be 500 characters or less');
    }

    const res = await fetch(`${BASE_URL}/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
    
    return await res.json();
  } catch (err) {
    console.error('Error updating profile:', err);
    throw err;
  }
};

const getPublicProfile = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  } catch (err) {
    console.error('Error fetching public profile:', err);
    throw err;
  }
};

export { getProfile, updateProfile, getPublicProfile };