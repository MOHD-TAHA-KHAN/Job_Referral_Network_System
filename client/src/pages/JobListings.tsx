import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { jobService, type Job } from '../services/jobService';
import AppSidebar from '../components/AppSidebar';
import NotificationBell from '../components/NotificationBell';
import '../styles/design-system.css';

const DashIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const BriefIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M6 2a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6zm0 1h4v1H6V3z"/></svg>;
const RefIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6A3 3 0 0 0 8 1zM2 13c0-2.8 2.7-5 6-5s6 2.2 6 5H2z"/></svg>;
const MsgIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-3 2V3a1 1 0 0 1 1-1z"/></svg>;

const NAV = [
  { path: '/dashboard', label: 'Dashboard',   icon: <DashIcon /> },
  { path: '/jobs',      label: 'Browse Jobs',  icon: <BriefIcon /> },
  { path: '/referrals', label: 'My Referrals', icon: <RefIcon /> },
  { path: '/chat',      label: 'Messages',     icon: <MsgIcon /> },
];

const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Software Engineer II', company: 'Google',  location: 'Bangalore', salary: '₹18–22 LPA', jobType: 'Full-time', experienceLevel: 'Entry Level (0-2 yrs)', description: "We're looking for a passionate Software Engineer to join the Google Cloud team. You will design, develop, and maintain scalable backend systems that serve millions of users globally.", requirements: "• B.E/B.Tech in Computer Science or related field\n• Proficiency in Python, Go, or Java with strong DSA fundamentals\n• Experience with distributed systems, cloud platforms (GCP preferred)" },
  { id: '2', title: 'React Developer',      company: 'Flipkart', location: 'Bengaluru', salary: '₹10–14 LPA', jobType: 'Full-time', experienceLevel: 'Entry Level (0-2 yrs)' },
  { id: '3', title: 'Data Analyst',         company: 'Infosys',  location: 'Hyderabad', salary: '₹6–9 LPA',  jobType: 'Full-time', experienceLevel: 'Mid Level (2-5 yrs)' },
];

const REFERRER_COUNTS: Record<string, number> = { '1': 6, '2': 3, '3': 8 };

const JobListings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Job | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [expFilter, setExpFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    jobService.getAllJobs().then(data => {
      const list = data.length > 0 ? data : MOCK_JOBS;
      setJobs(list);
      setSelected(list[0] ?? null);
    }).catch(() => {
      setJobs(MOCK_JOBS);
      setSelected(MOCK_JOBS[0]);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q);
    const matchExp  = !expFilter  || j.experienceLevel === expFilter;
    const matchLoc  = !locFilter  || j.location?.toLowerCase().includes(locFilter.toLowerCase());
    const matchType = !typeFilter || j.jobType === typeFilter;
    return matchSearch && matchExp && matchLoc && matchType;
  });

  const Radio = ({ name, value, current, onChange, label }: { name: string; value: string; current: string; onChange: (v: string) => void; label: string }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px 0' }}>
      <input type="radio" name={name} checked={current === value} onChange={() => onChange(current === value ? '' : value)}
        style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
      {label}
    </label>
  );

  return (
    <div className="app-shell">
      <AppSidebar items={NAV} />

      <div className="app-main" style={{ flexDirection: 'row', overflow: 'hidden' }}>
        {/* ── Filter panel ── */}
        <div style={{ width: 200, background: '#fff', borderRight: '1px solid var(--border)', padding: '20px 16px', flexShrink: 0, overflowY: 'auto' }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 16px', color: 'var(--text-primary)' }}>Filters</p>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Experience Level</p>
            {['Entry Level (0-2 yrs)', 'Mid Level (2-5 yrs)', 'Senior (5+ yrs)'].map(v => (
              <Radio key={v} name="exp" value={v} current={expFilter} onChange={setExpFilter} label={v} />
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Location</p>
            {['Bangalore', 'Hyderabad', 'Mumbai', 'Remote'].map(v => (
              <Radio key={v} name="loc" value={v} current={locFilter} onChange={setLocFilter} label={v} />
            ))}
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Job Type</p>
            {['Full-time', 'Internship'].map(v => (
              <Radio key={v} name="type" value={v} current={typeFilter} onChange={setTypeFilter} label={v} />
            ))}
          </div>
        </div>

        {/* ── Job list ── */}
        <div style={{ width: 260, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Search bar */}
          <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border)', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f7ff', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
              <input
                type="text"
                placeholder="Search job title, company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, flex: 1, fontFamily: 'var(--font)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ padding: '10px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{filtered.length} jobs found</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sort: Most Recent</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div className="empty-state">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">No jobs found</div>
            ) : filtered.map(job => (
              <div
                key={job.id}
                onClick={() => setSelected(job)}
                style={{
                  padding: '14px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selected?.id === job.id ? '#f0f4ff' : '#fff',
                  borderLeft: selected?.id === job.id ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.1s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4f6ef7', flexShrink: 0 }}>
                    {job.company[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>{job.company} · {job.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>{job.salary}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>⚡ {REFERRER_COUNTS[job.id] ?? 4} referrers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Job detail ── */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
          {selected ? (
            <div style={{ padding: '28px 32px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: '#4f6ef7', flexShrink: 0 }}>
                  {selected.company[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>{selected.title}</h2>
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {selected.company} · {selected.location} · {selected.jobType}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '3px 10px', fontWeight: 500 }}>📍 {selected.location}</span>
                    <span style={{ fontSize: 12, background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '3px 10px', fontWeight: 500 }}>₹ {selected.salary}</span>
                    <span style={{ fontSize: 12, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '3px 10px', fontWeight: 500 }}>Posted 2 days ago</span>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                <button className="btn btn-primary" onClick={() => navigate(`/jobs/${selected.id}`)}>
                  ✈ Request Referral
                </button>
                <button className="btn btn-outline">
                  🔖 Save Job
                </button>
              </div>

              <div className="divider" style={{ marginBottom: 24 }} />

              {/* About */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>About this Role</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  {selected.description ?? `We're looking for a passionate ${selected.title} to join the ${selected.company} team. You will design, develop, and maintain scalable systems that serve millions of users globally.`}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>Requirements</h3>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic' }}>
                  {selected.requirements ? (
                    selected.requirements.split('\n').map((line, i) => <p key={i} style={{ margin: '0 0 4px' }}>{line}</p>)
                  ) : (
                    <>
                      <p style={{ margin: '0 0 4px' }}>• B.E/B.Tech in Computer Science or related field</p>
                      <p style={{ margin: '0 0 4px' }}>• Strong fundamentals in DSA and system design</p>
                      <p style={{ margin: 0 }}>• Experience with relevant technologies</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: 80 }}>Select a job to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
