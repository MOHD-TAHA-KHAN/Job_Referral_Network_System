import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/auth.store'
import api from '../../services/api'
import NetworkBackground from '../../components/NetworkBackground'
import anime from 'animejs'

const Profile = () => {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const updateUser = useAuthStore(state => state.updateUser)
  
  const [formData, setFormData] = useState({
    skills: '',
    company: '',
    domain: '',
    resumeUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const profileRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile')
        setFormData({
          skills: data.profile.skills ? data.profile.skills.join(', ') : '',
          company: data.profile.company || '',
          domain: data.profile.domain || '',
          resumeUrl: data.profile.resumeUrl || ''
        })
      } catch (err) {
        toast.error('Failed to load profile details')
      } finally {
        setLoadingData(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (!loadingData && profileRef.current) {
      anime({
        targets: profileRef.current.querySelectorAll('.anime-item'),
        translateZ: [-150, 0],
        translateY: [40, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: anime.stagger(100)
      })
    }
  }, [loadingData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        resumeUrl: formData.resumeUrl
      }
      if (user.role === 'PROFESSIONAL' || user.role === 'HR') {
        payload.company = formData.company
        payload.domain = formData.domain
      }

      const { data } = await api.patch('/profile', payload)
      updateUser(data.profile)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Could not update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <>
        <NetworkBackground />
        <div className="dashboard-page" style={{textAlign: 'center', opacity: 0.5}}>Loading profile...</div>
      </>
    )
  }

  const isPro = user.role === 'PROFESSIONAL' || user.role === 'HR'

  return (
    <>
      <NetworkBackground />
      <div className="dashboard-page perspective-container" ref={profileRef}>
        <div className="dashboard-header anime-item">
          <div>
            <h1 style={{fontSize: '2.5rem', marginBottom: '8px'}}>{user.name}</h1>
            <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
          </div>
          <div className="header-actions">
            <button onClick={logout} className="btn btn-logout">Logout</button>
          </div>
        </div>

        <div className="glass-container profile-card">
          <h2 className="anime-item">Your Profile Details</h2>
          
          {!isPro && (
            <div className="info-alert anime-item">
              <strong>Tip:</strong> Adding relevant skills and a resume link greatly increases your chances of getting a referral!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group anime-item">
              <label>Skills (comma separated)</label>
              <input 
                type="text"
                name="skills"
                placeholder="e.g. React, Node.js, Python"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            {isPro && (
              <div className="form-row">
                <div className="form-group anime-item">
                  <label>Company</label>
                  <input 
                    type="text"
                    name="company"
                    placeholder="Where do you work?"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group anime-item">
                  <label>Domain</label>
                  <input 
                    type="text"
                    name="domain"
                    placeholder="e.g. Backend Engineering"
                    value={formData.domain}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group anime-item" style={{ marginBottom: '32px' }}>
              <label>Resume Drive Link / URL</label>
              <input 
                type="url"
                name="resumeUrl"
                placeholder="https://drive.google.com/..."
                value={formData.resumeUrl}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary anime-item" style={{ maxWidth: '200px' }}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}

export default Profile
