import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './UserProfile.scss'
function UserProfile({ user }) {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({ mine: 0, saved: 0, liked: 0, loading: true })

  useEffect(() => {
    if (!user?._id) return
    const qMine  = fetch(`/api/posts?author=${user._id}`).then(r => r.ok ? r.json() : [])
    const qSaved = fetch(`/api/posts?savedBy=${user._id}`).then(r => r.ok ? r.json() : [])
    const qLiked = fetch(`/api/posts?likedBy=${user._id}`).then(r => r.ok ? r.json() : [])
    Promise.all([qMine, qSaved, qLiked])
      .then(([m=[], s=[], l=[]]) => setCounts({ mine:m.length, saved:s.length, liked:l.length, loading:false }))
      .catch(() => setCounts(c => ({ ...c, loading:false })))
  }, [user?._id])

  if (!user) {
    return (
      <main className="profile">
        <section className="profile-card">
          <h2>Your Profile</h2>
          <p>You’re not signed in.</p>
          <Link className="btn btn-primary" to="/sign-in">Sign In</Link>
        </section>
      </main>
    )
  }

  const initial = (user.username || user.email || 'U').trim()[0]?.toUpperCase()

  return (
    <main className="profile">
      <button className="btn btn-light back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="title">Your Profile</h1>

      <section className="profile-grid">
        <aside className="profile-card identity">
          <div className="avatar">{initial}</div>
          <h2 className="uname">{user.username}</h2>
          {user.email && <div className="uemail">{user.email}</div>}
          {user.bio && <p className="ubio">{user.bio}</p>}
          <div className="identity-actions">
            <Link to="/profile/edit" className="btn btn-primary">Edit Profile</Link>
          </div>
        </aside>

        <section className="tiles">
          <ProfileTile to="/posts?mine=1"   title="Your Posts"        desc="Threads you started" count={counts.mine}  loading={counts.loading}/>
          <ProfileTile to="/posts?saved=1"  title="Favourite Posts"   desc="Saved for later"    count={counts.saved} loading={counts.loading}/>
          <ProfileTile to="/posts?liked=1"  title="Liked Posts"       desc="You gave a like"    count={counts.liked} loading={counts.loading}/>
        </section>
      </section>
    </main>
  )
}

function ProfileTile({ to, title, desc, count=0, loading }) {
  return (
    <Link to={to} className="tile">
      <div className="tile-count">{loading ? '…' : count}</div>
      <div className="tile-meta">
        <div className="tile-title">{title}</div>
        <div className="tile-desc">{desc}</div>
      </div>
    </Link>
  )
}
export default UserProfile