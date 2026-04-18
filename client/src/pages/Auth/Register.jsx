import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/auth.store'
import NetworkBackground from '../../components/NetworkBackground'
import anime from 'animejs'

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
  const cardRef = useRef(null)

  useEffect(() => {
    anime({
      targets: cardRef.current.querySelectorAll('.anime-item'),
      translateZ: [-100, 0],
      translateY: [30, 0],
      opacity: [0, 1],
      rotateX: [10, 0],
      easing: 'easeOutExpo',
      duration: 1200,
      delay: anime.stagger(100)
    })
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(formData)
      toast.success('Successfully created your account!')
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NetworkBackground />
      <div className="auth-page perspective-container">
        <div className="glass-container auth-card" ref={cardRef}>
          <h1 className="anime-item">Create Account</h1>
          <p className="subtitle anime-item">Join RefNet to connect with IT professionals.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group anime-item">
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

            <div className="form-group anime-item">
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
              <div className="form-group anime-item">
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
              
              <div className="form-group anime-item">
                <label>I am a...</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="FRESHER">Fresher</option>
                  <option value="PROFESSIONAL">IT Professional</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary anime-item" style={{ marginTop: '16px' }}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="anime-item" style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Register
