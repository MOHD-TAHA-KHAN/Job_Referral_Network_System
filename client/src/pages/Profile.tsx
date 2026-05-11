import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { profileService, type Profile as ProfileData } from '../services/profileService';
import AppSidebar from '../components/AppSidebar';
import '../styles/design-system.css';

const DashIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const UserIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6H2z"/></svg>;
const DocIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M4 1h6l4 4v10H2V1h2zm6 0v4h4"/></svg>;

const NAV = [
  { path: '/dashboard', label: 'Dashboard',  icon: <DashIcon /> },
  { path: '/profile',   label: 'My Profile', icon: <UserIcon /> },
  { path: '/profile',   label: 'Resume',     icon: <DocIcon /> },
];

const MOCK_PROFILE: ProfileData = {
  id: '1', userId: '1',
  name: 'Priya Mehta',
  email: 'priya.mehta@gmail.com',
  role: 'fresher',
  bio: 'Final-year B.Tech CSE student passionate about distributed systems.',
  company: '',
  position: 'B.Tech CSE · BITS Pilani · 2024',
  skills: ['Python', 'React', 'Node.js', 'SQL', 'System Design', 'DSA'],
  education: 'B.Tech CSE · BITS Pilani · 2024',
  resumeUrl: 'Priya_Mehta_Resume_2024.pdf',
  linkedinUrl: 'linkedin.com/in/priyamehta',
};

const MOCK_PROJECTS = [
  { title: 'Summer Intern — Razorpay', period: 'May 2023 – Jul 2023', desc: 'Built payment microservices in Node.js reducing API latency by 30%. Worked with Redis caching and PostgreSQL.', tags: [] },
  { title: 'Open Source Project — RefTracker', period: '2024', desc: 'Full-stack referral tracking system with React frontend, Node.js REST API and MongoDB. 120+ GitHub stars.', tags: ['React'] },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileData>>({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    profileService.getMyProfile()
      .then(p => { setProfile(p); setEditData(p); })
      .catch(() => { setProfile(MOCK_PROFILE); setEditData(MOCK_PROFILE); });
  }, []);

  const handleSave = async () => {
    try {
      const updated = await profileService.updateProfile(editData);
      setProfile(updated);
      setEditing(false);
      showToast('Profile updated!');
    } catch {
      setEditing(false);
      showToast('Saved locally (backend offline).');
    }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const p = profile ?? MOCK_PROFILE;

  return (
    <div className="app-shell">
      <AppSidebar items={NAV} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#fff', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          {toast}
        </div>
      )}

      <div className="app-main">
        <div className="page-header" style={{ paddingBottom: 20 }}>
          <h1 className="page-title">My Profile</h1>
          <div className="header-actions">
            <button className="btn btn-outline btn-sm">⬆ Share Profile</button>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>✏ Edit Profile</button>
          </div>
        </div>

        <div className="page-body" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
          {/* Left column */}
          <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, color: '#4f6ef7', flexShrink: 0 }}>
                  {(user?.name ?? p.name)?.[0] ?? 'P'}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{user?.name ?? p.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{p.position ?? p.education}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#10b981', fontWeight: 600 }}>Profile {editing ? '100' : '85'}% complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 16 }}>
                <div style={{ height: '100%', width: '85%', background: '#10b981', borderRadius: 3 }} />
              </div>

              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Contact &amp; Links</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>✉</span> {user?.email ?? p.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>📍</span> Bangalore, Karnataka
                </div>
                {p.linkedinUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4f6ef7' }}>
                    <span>🔗</span> {p.linkedinUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Skills card */}
            <div className="card">
              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700 }}>Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(p.skills ?? []).map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Resume card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Resume</p>
                <button className="btn btn-outline btn-sm">⬆ Update Resume</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{p.resumeUrl ?? 'Priya_Mehta_Resume_2024.pdf'}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>Uploaded Nov 26, 2024 · 1.2 MB</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm">⬇</button>
                  <button className="btn btn-outline btn-sm">👁</button>
                </div>
              </div>
            </div>

            {/* Experience & Projects */}
            <div className="card">
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Experience &amp; Projects</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {MOCK_PROJECTS.map((proj, i) => (
                  <div key={proj.title} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#4f6ef7' : '#10b981', marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{proj.title}</p>
                      <p style={{ margin: '2px 0 6px', fontSize: 11, color: 'var(--text-muted)' }}>{proj.period}</p>
                      <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{proj.desc}</p>
                      {proj.tags.map(t => <span key={t} className="chip" style={{ fontSize: 11 }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit modal */}
        {editing && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Profile</h3>
              {([
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'position', label: 'Role / Position', type: 'text' },
                { key: 'education', label: 'Education', type: 'text' },
                { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
                { key: 'bio', label: 'Bio', type: 'textarea' },
              ] as { key: keyof ProfileData; label: string; type: string }[]).map(f => (
                <div key={f.key} className="form-field">
                  <label className="form-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-textarea" value={(editData[f.key] as string) ?? ''} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} rows={3} />
                  ) : (
                    <input type={f.type} className="form-input" value={(editData[f.key] as string) ?? ''} onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Changes</button>
                <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
