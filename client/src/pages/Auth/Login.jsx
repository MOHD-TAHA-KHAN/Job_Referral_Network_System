import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/auth.store'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

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
    // This sends the user to your backend which then redirects to Google
    window.location.href = 'http://localhost:5000/api/auth/google';
};

  return (
    <div className="auth-page">
      <div className="glass-container auth-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to request referrals and grow your network.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="fresher@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: '16px' }}>
  
            <button 
              type="button" 
              className="btn google-btn" 
              onClick={handleGoogleLogin}
              style={{ backgroundColor: '#fff', color: '#000', width: '100%' }}
            >
            Login with Google
            </button>
          </div>  

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register">Create one now</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
