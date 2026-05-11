import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/design-system.css';

const MOCK_NOTIFS = [
  { id: '1', icon: '✅', iconBg: '#d1fae5', iconColor: '#10b981', title: 'Referral Accepted by Rahul Sharma', desc: 'Your referral request for SDE-II @ Google was accepted.', time: '2 min ago', unread: true },
  { id: '2', icon: '👥', iconBg: '#eff2ff', iconColor: '#4f6ef7', title: '3 New Referrers Available', desc: 'New professionals from Google match your SDE-II profile.', time: '1 hour ago', unread: true },
  { id: '3', icon: '💼', iconBg: '#fef3c7', iconColor: '#f59e0b', title: 'New Job Match — Frontend Dev @ Flipkart', desc: '3 referrers available. Don\'t miss out!', time: 'Yesterday', unread: false },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="notif-btn" onClick={() => setOpen(v => !v)}>
        🔔
        {unreadCount > 0 && <span className="notif-dot" />}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span className="notif-dropdown-title">
              Notifications
              {unreadCount > 0 && <span className="notif-count-badge">{unreadCount}</span>}
            </span>
            <button className="notif-mark-read" onClick={markAllRead}>✓ Mark all read</button>
          </div>

          {notifs.map(n => (
            <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
              <div className="notif-item-icon" style={{ background: n.iconBg, color: n.iconColor }}>
                {n.icon}
              </div>
              <div className="notif-item-body">
                <p className="notif-item-title">{n.title}</p>
                <p className="notif-item-desc">{n.desc}</p>
                <p className="notif-item-time">{n.time}</p>
              </div>
              {n.unread && <div className="notif-unread-dot" />}
            </div>
          ))}

          <button className="notif-view-all" onClick={() => { setOpen(false); navigate('/notifications'); }}>
            View all notifications →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
