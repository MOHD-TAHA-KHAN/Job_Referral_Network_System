import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/auth.store'
import NetworkBackground from '../../components/NetworkBackground'
import TiltCard from '../../components/TiltCard'
import anime from 'animejs'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()
  const cardRef = useRef(null)

  useEffect(() => {
    // Small timeout ensures cardRef completes its forwardRef mounting before anime queries it
    setTimeout(() => {
      if (!cardRef.current) return;
      anime({
        targets: cardRef.current.querySelectorAll('.anime-item'),
        translateZ: [-100, 0],
        translateY: [30, 0],
        opacity: [0, 1],
        rotateX: [10, 0],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: anime.stagger(150)
      })
    }, 50)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      toast.success('Successfully logged in!')
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <>
      <NetworkBackground alignment="left" />
      <div className="auth-page perspective-container" style={{ justifyContent: 'flex-end', paddingRight: '8%' }}>
        <TiltCard className="glass-container auth-card" ref={cardRef}>
          <h1 className="anime-item">Welcome Back</h1>
          <p className="subtitle anime-item">Login to request referrals and grow your network.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group anime-item">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="fresher@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>


            <div className="form-group anime-item" style={{ marginTop: '20px' }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary anime-item" style={{ marginTop: '20px' }}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>

            <div className="anime-item" style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
              <span style={{ padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
            </div>

            <div className="anime-item">
              <button 
                type="button" 
                className="btn google-btn" 
                onClick={handleGoogleLogin}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>

          <p className="anime-item" style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </TiltCard>
      </div>
    </>
  )
}

export default Login
