import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import '../styles/design-system.css';

type Role = 'Fresher' | 'Professional' | 'HR / Company';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<Role>('Fresher');

  useEffect(() => { if (isAuthenticated) navigate('/onboarding', { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => () => clearError(), [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roleMap: Record<Role, string> = { 'Fresher': 'fresher', 'Professional': 'professional', 'HR / Company': 'hr' };
    try { await signup(name, email, password, roleMap[role]); navigate('/onboarding'); } catch { /* error in store */ }
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL?.replace('/api', '')}/auth/google`;
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)',
    borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'var(--font)',
    color: 'var(--text-primary)', boxSizing: 'border-box' as const,
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
            Get referred.<br />Get hired faster.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
            Connect with IT professionals at your dream companies. Request referrals, track your status, and land your first job faster.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Direct referrals from verified employees',
            'AI-powered referrer matching',
            'Real-time status tracking',
            'In-app chat with referrers',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          {[{ v: '12,400+', l: 'Freshers Placed' }, { v: '3,800+', l: 'Professionals' }, { v: '94%', l: 'Response Rate' }].map(s => (
            <div key={s.l}>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>{s.v}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', margin: '2px 0 0' }}>{s.l}</p>
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
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>Create your account</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Join India's #1 referral network for freshers</p>

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

          {/* Google */}
          <button onClick={handleGoogle} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '11px', border: '1.5px solid var(--border)',
            borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--font)', marginBottom: 16,
          }}>
            <span style={{ width: 20, height: 20, background: '#ea4335', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>G</span>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            or
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" placeholder="Priya Mehta" value={name} onChange={e => setName(e.target.value)} required autoComplete="name"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none' }}>✉</span>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none' }}>🔒</span>
                <input type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password"
                  style={{ ...inputStyle, paddingLeft: 36 }}
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
              {isLoading ? 'Creating account…' : 'Get Referred Free'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: '20px 0 0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
