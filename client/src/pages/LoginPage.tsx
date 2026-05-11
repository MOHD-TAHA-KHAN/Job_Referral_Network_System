import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import MockOAuthButton from '../components/MockOAuthButton';
import '../styles/design-system.css';

type Role = 'Fresher' | 'Professional' | 'HR / Company';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<Role>('Fresher');

  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => () => clearError(), [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await login(email, password); navigate('/dashboard'); } catch { /* error in store */ }
  };

  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font)' }}>

      {/* ── Left: brand panel (40%) ── */}
      <div style={{
        width: '40%', flexShrink: 0,
        background: 'linear-gradient(160deg, #4f6ef7 0%, #3a52d4 100%)',
        padding: '56px 48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28,
      }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.3px' }}>RefNet</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.25, margin: '0 0 14px' }}>
            India's #1 platform<br />for referral-powered hiring.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
            Join 12,000+ freshers who landed jobs at Google, Flipkart, TCS and 500+ top companies through genuine referrals.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Direct referrals from verified employees',
            'Real-time status tracking (Pending → Referred)',
            'In-app chat with referrers',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: form (60%) ── */}
      <div style={{
        flex: 1,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>Welcome back 👋</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Sign in to your RefNet account</p>

          {/* Role tabs */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 4, gap: 2, marginBottom: 20 }}>
            {(['Fresher', 'Professional', 'HR / Company'] as Role[]).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 7, border: 'none',
                background: role === r ? '#fff' : 'transparent',
                fontWeight: role === r ? 600 : 400, fontSize: 12,
                color: role === r ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font)',
                boxShadow: role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Google OAuth - Mock for Testing */}
          <MockOAuthButton />

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            or
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none' }}>✉</span>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'var(--font)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none' }}>🔒</span>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'var(--font)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              background: 'var(--accent)', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)',
              opacity: isLoading ? 0.7 : 1, marginTop: 4,
            }}>
              {isLoading ? 'Signing in…' : 'Sign in to RefNet'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: '20px 0 0' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
