import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/auth.store'
import NetworkBackground from '../../components/NetworkBackground'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'FRESHER'
  })
  const [loading, setLoading] = useState(false)
  const register = useAuthStore(state => state.register)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(formData)
      toast.success('Successfully created your account!')
      navigate('/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NetworkBackground />
      <div className="auth-page">
        <div className="bento-card auth-card fade-in">
          <h1>Create Account</h1>
          <p className="subtitle">Join RefNet to connect with IT professionals.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text"
                name="name"
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email"
                name="email"
                placeholder="name@example.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password"
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  minLength={6}
                />
              </div>
              
              <div className="form-group">
                <label>I am a...</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="FRESHER">Fresher</option>
                  <option value="PROFESSIONAL">IT Professional</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Register
