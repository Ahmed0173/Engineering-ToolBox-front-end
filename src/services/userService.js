const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const getUserStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user stats');
    return await res.json();
  } catch (err) {
    console.error('Error fetching user stats:', err);
    throw err;
  }
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/currentUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch current user');
    return await res.json();
  } catch (err) {
    console.error('Error fetching current user:', err);
    throw err;
  }
};

const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};

export { getUserStats, getCurrentUser, getUserProfile };
