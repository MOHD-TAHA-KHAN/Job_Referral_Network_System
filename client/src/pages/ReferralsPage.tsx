import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { referralService, type Referral } from '../services/referralService';
import AppSidebar from '../components/AppSidebar';
import '../styles/design-system.css';

const DashIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const BriefIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M6 2a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6zm0 1h4v1H6V3z"/></svg>;
const RefIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6A3 3 0 0 0 8 1zM2 13c0-2.8 2.7-5 6-5s6 2.2 6 5H2z"/></svg>;
const MsgIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-3 2V3a1 1 0 0 1 1-1z"/></svg>;
const InboxIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M1 2h14v9H1V2zm0 9l3-4h8l3 4"/></svg>;

const FRESHER_NAV = [
  { path: '/dashboard', label: 'Dashboard',   icon: <DashIcon /> },
  { path: '/jobs',      label: 'Browse Jobs',  icon: <BriefIcon /> },
  { path: '/referrals', label: 'My Referrals', icon: <RefIcon /> },
  { path: '/chat',      label: 'Messages',     icon: <MsgIcon /> },
];

const PRO_NAV = [
  { path: '/referrals', label: 'Referral Inbox', icon: <InboxIcon /> },
  { path: '/referrals/given', label: 'Given Referrals', icon: <RefIcon /> },
  { path: '/profile',   label: 'My Profile',    icon: <RefIcon /> },
];

const MOCK_MY_REFERRALS: Referral[] = [
  { id: '1', jobId: '1', requesterId: '1', referrerId: '2', status: 'pending',   job: { title: 'SDE-2 @ Google',         company: 'Google',   location: 'Bangalore, Karnataka' }, referrer: { id: '2', name: 'Rahul Sharma',  email: '' }, createdAt: 'Dec 18, 2024' },
  { id: '2', jobId: '2', requesterId: '1', referrerId: '3', status: 'accepted',  job: { title: 'Frontend Dev @ Flipkart', company: 'Flipkart', location: 'Bengaluru'            }, referrer: { id: '3', name: 'Ananya Singh',  email: '' }, createdAt: 'Dec 15, 2024' },
  { id: '3', jobId: '3', requesterId: '1', referrerId: '4', status: 'completed', job: { title: 'Data Analyst @ Infosys',  company: 'Infosys',  location: 'Hyderabad'            }, referrer: { id: '4', name: 'Vikram Nair',   email: '' }, createdAt: 'Dec 10, 2024' },
];

const MOCK_INBOX: Referral[] = [
  { id: 'i1', jobId: '1', requesterId: 'u1', referrerId: 'me', status: 'pending', job: { title: 'SDE-II Role', company: 'Google', location: 'Bangalore' }, requester: { id: 'u1', name: 'Priya Mehta', email: 'priya@bits.ac.in' }, message: 'B.Tech CSE · BITS Pilani · 8.6 CGPA', createdAt: '2h ago' },
  { id: 'i2', jobId: '1', requesterId: 'u2', referrerId: 'me', status: 'pending', job: { title: 'SDE-II Role', company: 'Google', location: 'Bangalore' }, requester: { id: 'u2', name: 'Arjun Rao',   email: 'arjun@iitb.ac.in'  }, message: 'B.Tech IT · IIT Bombay · 9.1 CGPA',  createdAt: '5h ago' },
];

const TIMELINE_STEPS = [
  { label: 'Request Sent',      desc: 'You sent a referral request to Rahul Sharma',                    date: 'Dec 18, 2024 · 10:32 AM', done: true,    color: '#10b981' },
  { label: 'Request Accepted',  desc: 'Rahul Sharma accepted your referral request and started reviewing', date: 'Dec 19, 2024 · 02:15 PM', done: true,    color: '#10b981' },
  { label: 'Referred to HR',    desc: 'Your profile has been submitted to the Google hiring team',       date: 'Awaiting confirmation…',  done: 'partial', color: '#f59e0b' },
  { label: 'Interview Scheduled', desc: 'Pending',                                                      date: '',                        done: false,   color: '#d1d5db' },
];

type ViewMode = 'fresher' | 'professional';

const ReferralsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [mode] = useState<ViewMode>('fresher'); // toggle based on user.role
  const [tab, setTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [myReferrals, setMyReferrals] = useState<Referral[]>([]);
  const [inbox, setInbox] = useState<Referral[]>([]);
  const [selected, setSelected] = useState<Referral | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    referralService.getMyReferrals().then(r => setMyReferrals(r.length > 0 ? r : MOCK_MY_REFERRALS)).catch(() => setMyReferrals(MOCK_MY_REFERRALS));
    referralService.getReferralInbox().then(r => setInbox(r.length > 0 ? r : MOCK_INBOX)).catch(() => setInbox(MOCK_INBOX));
    setSelected(MOCK_MY_REFERRALS[0]);
  }, []);

  const handleAction = async (id: string, status: 'accepted' | 'rejected') => {
    setActionId(id);
    try {
      await referralService.updateReferralStatus(id, status);
      setInbox(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast(status === 'accepted' ? 'Referral accepted!' : 'Referral declined.');
    } catch {
      setInbox(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast(status === 'accepted' ? 'Accepted!' : 'Declined.');
    } finally { setActionId(null); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filteredInbox = tab === 'all' ? inbox : inbox.filter(r => r.status === tab);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected', completed: 'badge-referred' };
    const label: Record<string, string> = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected', completed: 'Referred' };
    return <span className={`badge ${map[status] ?? 'badge-pending'}`}>{label[status] ?? status}</span>;
  };

  // ── Professional view ──────────────────────────────────────────────────────
  if (mode === 'professional') {
    return (
      <div className="app-shell">
        <AppSidebar items={PRO_NAV} roleBadge={{ label: 'Professional', type: 'professional' }} />
        <div className="app-main">
          <div className="page-header" style={{ paddingBottom: 20 }}>
            <div>
              <h1 className="page-title">Referral Requests</h1>
              <p className="page-subtitle">{inbox.filter(r => r.status === 'pending').length} pending requests · Please respond within 48 hours</p>
            </div>
          </div>
          <div className="page-body">
            <div className="tabs">
              {(['all', 'pending', 'accepted', 'rejected'] as const).map(t => (
                <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'all' && <span className="tab-count">{inbox.length}</span>}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredInbox.map(req => (
                <div key={req.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#4f6ef7', flexShrink: 0 }}>
                    {req.requester?.name?.[0] ?? 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{req.requester?.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{req.message}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Requested {req.createdAt}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <span className="chip" style={{ fontSize: 11 }}>For: {req.job?.title}</span>
                      <span className="chip" style={{ fontSize: 11 }}>Python · React</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {req.status === 'pending' ? (
                      <>
                        <button className="btn btn-outline btn-sm" style={{ color: '#4f6ef7', borderColor: '#c7d2fe' }}>👁 View Profile</button>
                        <button className="btn btn-red-outline btn-sm" disabled={actionId === req.id} onClick={() => handleAction(req.id, 'rejected')}>Decline</button>
                        <button className="btn btn-green btn-sm" disabled={actionId === req.id} onClick={() => handleAction(req.id, 'accepted')}>Accept</button>
                      </>
                    ) : statusBadge(req.status)}
                  </div>
                </div>
              ))}
              {filteredInbox.length === 0 && <div className="empty-state">No requests in this category.</div>}
            </div>
          </div>
        </div>
        {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#fff', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, zIndex: 1000 }}>{toast}</div>}
      </div>
    );
  }

  // ── Fresher view (Referral Detail + Status) ────────────────────────────────
  return (
    <div className="app-shell">
      <AppSidebar items={FRESHER_NAV} />
      <div className="app-main">
        <div className="page-header" style={{ paddingBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>← My Referrals</button>
            {selected && <><span>/</span><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selected.job?.title}</span></>}
          </div>
        </div>

        <div className="page-body" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
          {/* Left: referral list */}
          <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myReferrals.map(ref => (
              <div
                key={ref.id}
                className="card card-sm"
                style={{ cursor: 'pointer', border: selected?.id === ref.id ? '2px solid var(--accent)' : '1px solid var(--border)', background: selected?.id === ref.id ? '#f0f4ff' : '#fff' }}
                onClick={() => setSelected(ref)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#4f6ef7', flexShrink: 0 }}>
                    {ref.job?.company?.[0] ?? 'C'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{ref.job?.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{ref.job?.company} · {ref.job?.location}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Submitted {ref.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center: timeline */}
          {selected && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Job card */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#4f6ef7', flexShrink: 0 }}>
                    {selected.job?.company?.[0] ?? 'C'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{selected.job?.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{selected.job?.company} · {selected.job?.location}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Submitted {selected.createdAt}</p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>₹18–22 LPA</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Referral Timeline</p>
                  {statusBadge(selected.status)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={step.label} style={{ display: 'flex', gap: 14, paddingBottom: i < TIMELINE_STEPS.length - 1 ? 20 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.done === true ? step.color : step.done === 'partial' ? step.color : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: step.done ? '#fff' : '#9ca3af', flexShrink: 0 }}>
                          {step.done === true ? '✓' : step.done === 'partial' ? '⏳' : '○'}
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div style={{ width: 2, flex: 1, background: step.done === true ? step.color : '#e5e7eb', minHeight: 20 }} />
                        )}
                      </div>
                      <div style={{ paddingTop: 4 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{step.desc}</p>
                        {step.date && <p style={{ margin: '2px 0 0', fontSize: 11, color: step.done === 'partial' ? '#f59e0b' : 'var(--text-muted)' }}>{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right: referrer card + note */}
          {selected && (
            <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Your Referrer</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#4f6ef7', flexShrink: 0 }}>
                    {selected.referrer?.name?.[0] ?? 'R'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{selected.referrer?.name ?? 'Rahul Sharma'}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>SDE-3 · Google</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#10b981', fontWeight: 600 }}>12 referrals given · 4 yrs at Google</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/chat')}>
                  💬 Send Message
                </button>
              </div>

              <div className="card">
                <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Your Application Note</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "Hi Rahul, I'm a final-year B.Tech CSE student passionate about distributed systems. I have strong fundamentals in Python and Go. I'd really appreciate your support for the SDE-II role at Google."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#fff', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 600, zIndex: 1000 }}>{toast}</div>}
    </div>
  );
};

export default ReferralsPage;
