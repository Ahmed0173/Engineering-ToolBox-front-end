import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, uploadAvatar } from '../../services/profileService';
import './UserProfile.scss';

// file -> base64 for your uploadAvatar({ image: base64 })
const toBase64 = (file) => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => resolve(fr.result);
  fr.onerror = reject;
  fr.readAsDataURL(file);
});

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
    avatarUrl: user.avatar || '', // optional direct URL
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initial = (form.username || user.email || 'U').trim()[0]?.toUpperCase();
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onPick   = (e) => setFile(e.target.files?.[0] || null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      // 1) upload avatar file if chosen
      if (file) {
        const b64 = await toBase64(file);
        await uploadAvatar(b64);
      }
      // 2) update username/bio (+ avatar URL if provided)
      const payload = { username: form.username, bio: form.bio };
      if (form.avatarUrl) payload.avatar = form.avatarUrl;
      await updateProfile(payload);

      // 3) refresh app user so navbar/profile update
      const fresh = await getProfile();
      onUpdated?.(fresh.user || fresh);

      navigate('/profile');
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
              ? <img src={form.avatarUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
              : <span>{initial}</span>}
          </div>
          <h2 className="uname">{form.username || user.username}</h2>
          <div className="uemail">{user.email}</div>
          {form.bio && <p className="ubio">{form.bio}</p>}
        </aside>

        {/* RIGHT form */}
        <section className="profile-card" style={{ display:'grid', gap:'0.8rem' }}>
          <form onSubmit={onSubmit} className="identity-actions" style={{ display:'grid', gap:'.75rem' }}>
            <label style={{ display:'grid', gap:'.35rem' }}>
              Username
              <input name="username" value={form.username} onChange={onChange} required />
            </label>

            <label style={{ display:'grid', gap:'.35rem' }}>
              Bio
              <textarea name="bio" rows={4} maxLength={500} value={form.bio} onChange={onChange} />
            </label>

            <label style={{ display:'grid', gap:'.35rem' }}>
              Avatar URL (optional)
              <input name="avatarUrl" value={form.avatarUrl} onChange={onChange} placeholder="https://…" />
            </label>

            <label style={{ display:'grid', gap:'.35rem' }}>
              Or upload an image
              <input type="file" accept="image/*" onChange={onPick} />
            </label>

            {error && <p style={{ color:'#b91c1c' }}>{error}</p>}
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
