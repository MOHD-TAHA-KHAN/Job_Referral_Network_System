import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Handles the redirect from Google OAuth.
 * The backend should redirect to /auth/callback?token=<jwt>
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const initAuth = useAuthStore(s => s.initAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      initAuth().then(() => navigate('/dashboard', { replace: true }));
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [navigate, initAuth]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0f0f0f',
      color: '#555',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
    }}>
      Signing you in…
    </div>
  );
};

export default OAuthCallback;
