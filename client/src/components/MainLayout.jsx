import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';
import NetworkBackground from './NetworkBackground';
import TiltCard from './TiltCard';

const MainLayout = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <NetworkBackground />
      
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Global Glass Navbar */}
        <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '2px', color: '#fff' }}>
            <span style={{ color: '#3b82f6' }}>REF</span>NET
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" style={({isActive}) => ({
                  color: isActive ? '#fff' : '#94a3b8',
                  fontWeight: isActive ? 600 : 400
                })}>
                  Dashboard
                </NavLink>
                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <button onClick={handleLogout} className="btn btn-logout" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={({isActive}) => ({
                  color: isActive ? '#fff' : '#94a3b8'
                })}>
                  Sign In
                </NavLink>
                <NavLink to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
