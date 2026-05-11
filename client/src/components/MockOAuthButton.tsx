import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';

const MockOAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleMockGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate OAuth callback with mock token
      const mockToken = 'mock-google-jwt-token';
      
      // Store the mock token
      localStorage.setItem('authToken', mockToken);
      
      // Get user data with the mock token
      const user = await authService.getMe();
      
      // Update auth store directly
      useAuthStore.setState({ 
        user, 
        token: mockToken, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Mock OAuth failed:', error);
      // Fallback: try regular login with mock credentials
      try {
        await login('mockuser@gmail.com', 'password');
        navigate('/dashboard');
      } catch (fallbackError) {
        console.error('Fallback login failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleMockGoogleLogin}
      disabled={isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        padding: '11px',
        border: '1.5px solid var(--border)',
        borderRadius: 10,
        background: '#fff',
        fontSize: 14,
        fontWeight: 500,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font)',
        marginBottom: 16,
        opacity: isLoading ? 0.7 : 1
      }}
    >
      <span style={{ 
        width: 20, 
        height: 20, 
        background: '#ea4335', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#fff', 
        fontSize: 11, 
        fontWeight: 700, 
        flexShrink: 0 
      }}>
        G
      </span>
      {isLoading ? 'Connecting to Google...' : 'Continue with Google (Mock)'}
    </button>
  );
};

export default MockOAuthButton;
