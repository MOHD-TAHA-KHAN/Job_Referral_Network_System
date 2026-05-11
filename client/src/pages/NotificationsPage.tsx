import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppSidebar from '../components/AppSidebar';
import '../styles/design-system.css';

const DashIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const BellIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M8 1a5 5 0 0 0-5 5v3l-1 2h12l-1-2V6a5 5 0 0 0-5-5zm-1 13a1 1 0 0 0 2 0H7z"/></svg>;

const NAV = [
  { path: '/dashboard',     label: 'Dashboard',     icon: <DashIcon /> },
  { path: '/notifications', label: 'Notifications', icon: <BellIcon />, badge: 5 },
];

const TODAY_NOTIFS = [
  { id: '1', icon: '✅', iconBg: '#d1fae5', iconColor: '#10b981', title: 'Referral Request Accepted', desc: 'Rahul Sharma accepted your referral request for SDE-II @ Google. He\'ll review your profile and reach out shortly.', time: '2 minutes ago', unread: true, action: null },
  { id: '2', icon: '👥', iconBg: '#eff2ff', iconColor: '#4f6ef7', title: '3 New Referrers Available', desc: '3 new professionals from Google match your profile for the SDE-II role. Check them out and request referrals.', time: '1 hour ago', unread: true, action: 'View Referrers' },
  { id: '3', icon: '💬', iconBg: '#d1fae5', iconColor: '#10b981', title: 'New Message from Rahul Sharma', desc: '"Great! I\'ll forward your profile today. All the best for the SDE-II role at Google!"', time: '3 hours ago', unread: false, action: null },
];

const YESTERDAY_NOTIFS = [
  { id: '4', icon: '💼', iconBg: '#fef3c7', iconColor: '#f59e0b', title: 'New Job Match — Frontend Dev @ Flipkart', desc: 'A new job matching your profile has been posted. 3 referrers are available. Apply now!', time: 'Yesterday, 10:22 AM', unread: false, action: null },
  { id: '5', icon: '✈', iconBg: '#eff2ff', iconColor: '#4f6ef7', title: 'Referral Successfully Submitted', desc: 'Vikram Nair submitted your referral for Data Analyst @ Infosys. You\'ll hear back within 5–7 business days.', time: 'Yesterday, 4:55 PM', unread: false, action: null },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState({ today: TODAY_NOTIFS, yesterday: YESTERDAY_NOTIFS });

  const markAllRead = () => {
    setNotifs(prev => ({
      today: prev.today.map(n => ({ ...n, unread: false })),
      yesterday: prev.yesterday.map(n => ({ ...n, unread: false })),
    }));
  };

  const unreadCount = [...notifs.today, ...notifs.yesterday].filter(n => n.unread).length;

  const NotifItem = ({ n }: { n: typeof TODAY_NOTIFS[0] }) => (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 24px',
      background: n.unread ? '#f5f7ff' : '#fff',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
      transition: 'background 0.1s',
    }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: n.iconBg, color: n.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {n.icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{n.title}</p>
        <p style={{ margin: '4px 0 6px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>{n.desc}</p>
        {n.action && (
          <button className="btn btn-primary btn-sm" style={{ marginBottom: 6 }} onClick={() => navigate('/jobs')}>
            {n.action}
          </button>
        )}
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{n.time}</p>
      </div>
      {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />}
    </div>
  );

  return (
    <div className="app-shell">
      <AppSidebar items={NAV} />

      <div className="app-main">
        <div className="page-header" style={{ paddingBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Notifications</h1>
            {unreadCount > 0 && <span className="notif-count-badge">{unreadCount}</span>}
          </div>
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>✓ Mark all read</button>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', margin: '0 28px', overflow: 'hidden' }}>
          {/* Today */}
          <div style={{ padding: '10px 24px 6px', background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today</p>
          </div>
          {notifs.today.map(n => <NotifItem key={n.id} n={n} />)}

          {/* Yesterday */}
          <div style={{ padding: '10px 24px 6px', background: '#f9fafb', borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yesterday</p>
          </div>
          {notifs.yesterday.map(n => <NotifItem key={n.id} n={n} />)}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
