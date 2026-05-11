import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { jobService, type Job } from '../services/jobService';
import { referralService, type Referral } from '../services/referralService';
import AppSidebar from '../components/AppSidebar';
import NotificationBell from '../components/NotificationBell';
import '../styles/design-system.css';

const DashIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const BriefIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M6 2a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6zm0 1h4v1H6V3z"/></svg>;
const RefIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6A3 3 0 0 0 8 1zM2 13c0-2.8 2.7-5 6-5s6 2.2 6 5H2z"/></svg>;
const MsgIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-3 2V3a1 1 0 0 1 1-1z"/></svg>;
const UserIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6H2z"/></svg>;

const NAV = [
  { path: '/dashboard', label: 'Dashboard',   icon: <DashIcon /> },
  { path: '/jobs',      label: 'Browse Jobs',  icon: <BriefIcon /> },
  { path: '/referrals', label: 'My Referrals', icon: <RefIcon /> },
  { path: '/chat',      label: 'Messages',     icon: <MsgIcon /> },
  { path: '/profile',   label: 'My Profile',   icon: <UserIcon /> },
];

const STAT_COLORS = [
  { bg: '#eff2ff', icon: '📤', color: '#4f6ef7' },
  { bg: '#fef3c7', icon: '⏳', color: '#f59e0b' },
  { bg: '#d1fae5', icon: '✅', color: '#10b981' },
  { bg: '#fce7f3', icon: '👁', color: '#ec4899' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobService.getAllJobs().catch(() => [] as Job[]),
      referralService.getMyReferrals().catch(() => [] as Referral[]),
    ]).then(([j, r]) => { setJobs(j); setReferrals(r); setLoading(false); });
  }, []);

  const stats = [
    { label: 'Referrals Sent', value: referrals.length || 5 },
    { label: 'Pending',        value: referrals.filter(r => r.status === 'pending').length || 3 },
    { label: 'Referred',       value: referrals.filter(r => r.status === 'accepted').length || 1 },
    { label: 'Profile Views',  value: 42 },
  ];

  // Mock referrals for display when API is empty
  const displayReferrals: Referral[] = referrals.length > 0 ? referrals : [
    { id: '1', jobId: '1', requesterId: '1', referrerId: '2', status: 'pending',  job: { title: 'SDE-2 @ Google',        company: 'Google',   location: 'Bangalore' }, referrer: { id: '2', name: 'Rahul Sharma',  email: '' }, createdAt: '2 days ago' },
    { id: '2', jobId: '2', requesterId: '1', referrerId: '3', status: 'accepted', job: { title: 'Frontend Dev @ Flipkart', company: 'Flipkart', location: 'Bangalore' }, referrer: { id: '3', name: 'Ananya Singh',  email: '' }, createdAt: '5 days ago' },
    { id: '3', jobId: '3', requesterId: '1', referrerId: '4', status: 'completed',job: { title: 'Data Analyst @ Infosys', company: 'Infosys',  location: 'Hyderabad' }, referrer: { id: '4', name: 'Vikram Nair',   email: '' }, createdAt: '1 week ago' },
  ];

  const displayJobs: Job[] = jobs.length > 0 ? jobs : [
    { id: '1', title: 'Software Engineer II', company: 'Google',  location: 'Bangalore · Full-time', salary: '₹18–22 LPA', jobType: 'Full-time' },
    { id: '2', title: 'React Developer',      company: 'Flipkart', location: 'Bengaluru · Full-time', salary: '₹10–14 LPA', jobType: 'Full-time' },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { pending: 'badge-pending', accepted: 'badge-accepted', rejected: 'badge-rejected', completed: 'badge-referred', referred: 'badge-referred' };
    const label: Record<string, string> = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected', completed: 'Referred', referred: 'Referred' };
    return <span className={`badge ${map[status] ?? 'badge-pending'}`}>{label[status] ?? status}</span>;
  };

  return (
    <div className="app-shell">
      <AppSidebar items={NAV} />

      <div className="app-main">
        {/* Header */}
        <div className="page-header" style={{ paddingBottom: 20 }}>
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] ?? 'Priya'} 👋</h1>
            <p className="page-subtitle">Here's what's happening with your referrals today</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1L1 8l7 7v-4c4 0 6 1 7 4-1-4-2-7-7-7V1z"/>
              </svg>
              Home
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => navigate('/profile')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="5" r="3"/>
                <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6H2z"/>
              </svg>
              Edit Profile
            </button>
            <NotificationBell />
            <div className="user-avatar-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#4f6ef7', color: '#fff', fontWeight: 700, fontSize: 14 }}>
              {user?.name?.[0] ?? 'P'}
            </div>
          </div>
        </div>

        <div className="page-body">
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {stats.map((s, i) => (
              <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: STAT_COLORS[i].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {STAT_COLORS[i].icon}
                </div>
                <div>
                  <p style={{ fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Active Referrals */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Active Referrals</h3>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/referrals')}>View All →</button>
              </div>
              {loading ? <div className="empty-state">Loading…</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {displayReferrals.map(ref => (
                    <div key={ref.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#4f6ef7', flexShrink: 0 }}>
                        {ref.job?.company?.[0] ?? 'C'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{ref.job?.title ?? 'Job'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>
                          Referrer: {ref.referrer?.name ?? '—'} · {ref.createdAt ?? ''}
                        </p>
                      </div>
                      {statusBadge(ref.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Jobs */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Recommended Jobs</h3>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/jobs')}>See All →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayJobs.slice(0, 3).map(job => (
                  <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#4f6ef7', flexShrink: 0 }}>
                      {job.company?.[0] ?? 'C'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{job.title}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{job.company} · {job.location}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#10b981', fontWeight: 500 }}>⚡ 6 referrers available</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/jobs/${job.id}`)}>Get Referred</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
