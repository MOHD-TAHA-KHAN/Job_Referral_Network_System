import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Set to true to preview all pages without logging in
const DEV_BYPASS_AUTH = true;

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isLoading = useAuthStore(s => s.isLoading);

  // Dev bypass: skip auth check so you can browse all pages
  if (DEV_BYPASS_AUTH) {
    return <>{children}</>;
  }

  if (isLoading) {
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
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
