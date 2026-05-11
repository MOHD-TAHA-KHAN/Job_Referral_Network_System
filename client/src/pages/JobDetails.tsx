import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { jobService, type Job } from '../services/jobService';
import { referralService, type ReferralMatch } from '../services/referralService';
import AppSidebar from '../components/AppSidebar';
import '../styles/design-system.css';

const BriefIcon = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M6 2a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6zm0 1h4v1H6V3z"/></svg>;
const RefIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6A3 3 0 0 0 8 1zM2 13c0-2.8 2.7-5 6-5s6 2.2 6 5H2z"/></svg>;

const NAV = [
  { path: '/jobs',      label: 'Browse Jobs',   icon: <BriefIcon /> },
  { path: '/jobs/find', label: 'Find Referrers', icon: <RefIcon /> },
];

const MOCK_MATCHES: ReferralMatch[] = [
  { userId: '1', name: 'Rahul Sharma',  company: 'Google',  role: 'SDE-3',     matchScore: 98, skills: ['Python', 'System Design', 'GCP'],  yearsAtCompany: 4, totalReferrals: 12 },
  { userId: '2', name: 'Ananya Singh',  company: 'Google',  role: 'SDE-2',     matchScore: 92, skills: ['React', 'Node.js'],                yearsAtCompany: 2, totalReferrals: 5  },
  { userId: '3', name: 'Vikram Nair',   company: 'Google',  role: 'Staff SWE', matchScore: 85, skills: ['Java', 'Kubernetes'],              yearsAtCompany: 6, totalReferrals: 20 },
];

const Stars = ({ n = 5 }: { n?: number }) => (
  <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
);

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [matches, setMatches] = useState<ReferralMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      jobService.getJobById(id).catch(() => null),
      referralService.getMatchesForJob(id).catch(() => [] as ReferralMatch[]),
    ]).then(([j, m]) => {
      setJob(j ?? { id: id, title: 'Software Engineer II', company: 'Google', location: 'Bangalore, Karnataka', salary: '₹18–22 LPA', jobType: 'Full-time' });
      setMatches(m.length > 0 ? m : MOCK_MATCHES);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async (referrerId: string) => {
    if (!id) return;
    setRequestingId(referrerId);
    try {
      await referralService.createReferral({ jobId: id, referrerId });
      setRequestedIds(prev => new Set(prev).add(referrerId));
      showToast('Referral request sent!');
    } catch {
      showToast('Failed to send request.');
    } finally {
      setRequestingId(null);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

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
          <div>
            <h1 className="page-title">Suggested Referrers</h1>
            <p className="page-subtitle">For: {job?.title ?? '…'} @ {job?.company ?? '…'}</p>
          </div>
        </div>

        <div className="page-body">
          {/* Info bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f7ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#4f6ef7' }}>
            <span>ℹ</span>
            Match score is based on company, domain, seniority &amp; mutual connections
          </div>

          {loading ? (
            <div className="empty-state">Finding best referrers…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {matches.map((match, idx) => (
                <div
                  key={match.userId}
                  className="card"
                  style={{
                    border: idx === 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {/* Top match banner */}
                  {idx === 0 && (
                    <div style={{ background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, textAlign: 'center', marginBottom: 4 }}>
                      ⭐ Top Match · {match.matchScore}% Compatibility
                    </div>
                  )}

                  {/* Match score badge for non-top */}
                  {idx > 0 && (
                    <div style={{ position: 'absolute', top: 14, right: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: idx === 1 ? '#d1fae5' : '#fef3c7', color: idx === 1 ? '#065f46' : '#92400e', borderRadius: 6, padding: '3px 8px' }}>
                        {match.matchScore}% Match
                      </span>
                    </div>
                  )}

                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#4f6ef7', flexShrink: 0 }}>
                      {match.name[0]}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{match.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{match.role} @ {match.company}</p>
                      {idx === 0 && <Stars n={5} />}
                    </div>
                  </div>

                  {/* Skills */}
                  {match.skills && match.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {match.skills.map(s => <span key={s} className="chip">{s}</span>)}
                    </div>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                    {match.yearsAtCompany != null && (
                      <span style={{ color: 'var(--text-secondary)' }}>{match.yearsAtCompany} yrs @ {match.company}</span>
                    )}
                    {match.totalReferrals != null && (
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{match.totalReferrals} referrals given</span>
                    )}
                  </div>

                  {/* Request button */}
                  <button
                    className={`btn ${requestedIds.has(match.userId) ? 'btn-outline' : 'btn-primary'}`}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                    disabled={requestingId === match.userId || requestedIds.has(match.userId)}
                    onClick={() => handleRequest(match.userId)}
                  >
                    {requestedIds.has(match.userId) ? '✓ Request Sent' : requestingId === match.userId ? 'Sending…' : '✈ Request Referral'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-outline" onClick={() => navigate('/jobs')} style={{ alignSelf: 'flex-start' }}>
            ← Back to Browse Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
