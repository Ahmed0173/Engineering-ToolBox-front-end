import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../../services/profileService';
import './UserProfile.scss';

export default function ProfileEdit({ user, onUpdated }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="profile">
        <section className="profile-card">
          <h2>Edit Profile</h2>
          <p>You’re not signed in.</p>
          <Link className="btn btn-primary" to="/sign-in">Sign In</Link>
        </section>
      </main>
    );
  }

  const [form, setForm] = useState({
    username: user.username || '',
    bio: user.bio || '',
    contactInfo: user.contactInfo || '',
    title: user.title || '',
    avatarUrl: user.avatar || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initial = (form.username || user.email || 'U').trim()[0]?.toUpperCase();
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value }); const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      // Update profile data
      const payload = {
        username: form.username,
        bio: form.bio,
        contactInfo: form.contactInfo,
        title: form.title
      };

      // Add avatar URL if provided
      if (form.avatarUrl) {
        payload.avatar = form.avatarUrl;
      }

      await updateProfile(payload);

      // 3) refresh app user so navbar/profile update
      const fresh = await getProfile();
      const updatedUser = fresh.user || fresh;
      onUpdated?.(updatedUser);

      navigate('/users/profile');
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="profile">
      <button className="btn btn-light back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="title">Edit Profile</h1>

      <section className="profile-grid">
        {/* LEFT preview (same look as your profile) */}
        <aside className="profile-card identity">
          <div className="avatar">
            {form.avatarUrl
              ? <img src={form.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : <img src="https://cdn.pfps.gg/pfps/2301-default-2.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />}
          </div>
          <h2 className="uname">{form.username || user.username}</h2>
          {form.title && <div className="user-title">{form.title}</div>}
          <div className="uemail">{user.email}</div>
          {form.bio && <p className="ubio">{form.bio}</p>}
          {form.contactInfo && <div className="user-contact">📞 {form.contactInfo}</div>}
        </aside>

        {/* RIGHT form */}
        <section className="profile-card" style={{ display: 'grid', gap: '0.8rem' }}>
          <form onSubmit={onSubmit} className="identity-actions" style={{ display: 'grid', gap: '.75rem' }}>
            <label style={{ display: 'grid', gap: '.35rem' }}>
              Username
              <input name="username" value={form.username} onChange={onChange} required minLength={3} />
            </label>

            <label style={{ display: 'grid', gap: '.35rem' }}>
              Professional Title
              <input name="title" value={form.title} onChange={onChange} placeholder="e.g., Software Engineer, Student" maxLength={100} />
            </label>

            <label style={{ display: 'grid', gap: '.35rem' }}>
              Contact Info
              <input name="contactInfo" value={form.contactInfo} onChange={onChange} placeholder="e.g., LinkedIn, Phone" maxLength={200} />
            </label>

            <label style={{ display: 'grid', gap: '.35rem' }}>
              Bio
              <textarea
                name="bio"
                rows={4}
                maxLength={500}
                value={form.bio}
                onChange={onChange}
                placeholder="Tell us about yourself..."
              />
              <small style={{ color: '#6b5a5a', fontSize: '0.85rem' }}>
                {form.bio.length}/500 characters
              </small>
            </label>

            <label style={{ display: 'grid', gap: '.35rem' }}>
              Avatar Image URL
              <input
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={onChange}
                placeholder="https://example.com/your-image.jpg"
              />
            </label>

            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
