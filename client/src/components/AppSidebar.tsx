import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/design-system.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AppSidebarProps {
  items: NavItem[];
  roleBadge?: { label: string; type: 'professional' | 'hr' };
}

const GridIcon = () => (
  <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
    <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor">
    <path d="M8 1L1 6v9h4V9h6v6h4V6L8 1z"/>
  </svg>
);

export const RefNetLogo = () => (
  <svg viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="11" width="14" height="2.5" rx="1.25"/>
    <rect x="2" y="7"  width="10" height="2.5" rx="1.25"/>
    <rect x="2" y="3"  width="7"  height="2.5" rx="1.25"/>
  </svg>
);

const AppSidebar = ({ items, roleBadge }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => navigate('/dashboard')}>
        <div className="sidebar-brand-icon"><RefNetLogo /></div>
        <span className="sidebar-brand-name">RefNet</span>
      </div>

      {roleBadge && (
        <span className={`sidebar-role-badge ${roleBadge.type}`} style={{ alignSelf: 'flex-start', marginLeft: 8, marginTop: -12 }}>
          {roleBadge.label}
        </span>
      )}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => (
          <button
            key={item.path}
            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
            {item.badge != null && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      {/* Back to Home button */}
      <button
        className="sidebar-nav-item"
        onClick={() => navigate('/')}
        style={{ marginBottom: 8, opacity: 0.7 }}
      >
        <HomeIcon />
        Back to Home
      </button>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.name ?? 'User'}</p>
          <p className="sidebar-user-sub" style={{ cursor: 'pointer' }} onClick={handleLogout}>Sign out</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
