import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/auth.store'
import api from '../../services/api'
import NetworkBackground from '../../components/NetworkBackground'
import TiltCard from '../../components/TiltCard'
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
    if (!loadingData) {
      setTimeout(() => {
        if (!profileRef.current) return;
        anime({
          targets: profileRef.current.querySelectorAll('.anime-item'),
          translateZ: [-150, 0],
          translateY: [40, 0],
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 1000,
          delay: anime.stagger(100)
        })
      }, 50)
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

  const isFresher = user.role === 'FRESHER'
  const isProfessional = user.role === 'PROFESSIONAL'
  const isHR = user.role === 'HR'

  const roleSummary = isFresher
    ? 'As a Fresher, your profile should highlight skills, learning goals, and why you need a referral.'
    : isProfessional
      ? 'As an IT Professional, your profile shows your current company, domain expertise, and referral readiness.'
      : 'As an HR user, your profile is used to manage jobs and connect candidates with referral opportunities.'

  return (
    <>
      <NetworkBackground alignment="right" />
      <div className="dashboard-page profile-page perspective-container" ref={profileRef}>
        <div className="dashboard-header anime-item">
          <div>
            <h1 style={{fontSize: '2.5rem', marginBottom: '8px'}}>{user.name}</h1>
            <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
          </div>
          <div className="header-actions">
            {isHR ? (
              <Link to="/jobs" className="btn btn-primary">Manage Jobs</Link>
            ) : (
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            )}
            <Link to="/referrals" className="btn btn-secondary">My Referrals</Link>
            <button onClick={logout} className="btn btn-logout">Logout</button>
          </div>
        </div>

        <TiltCard className="glass-container profile-card">
          <h2 className="anime-item">Your Profile Details</h2>
          <div className={`role-summary anime-item ${user.role.toLowerCase()}`}>
            {roleSummary}
          </div>

          {!isHR && (
            <div className={`info-alert anime-item ${user.role.toLowerCase()}`}>
              {isFresher && (
                <><strong>Tip:</strong> Add your strongest skills and resume link to improve referral results.</>
              )}
              {isProfessional && (
                <><strong>Tip:</strong> Keep your company and domain up to date so candidates can find the right referrer.</>
              )}
            </div>
          )}

          {isHR && (
            <div className="info-alert anime-item hr">
              <strong>HR Note:</strong> Add your company and domain, then use the job dashboard to post roles and review referrals.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group anime-item">
              <label>Skills (comma separated)</label>
              <input 
                type="text"
                name="skills"
                placeholder={isFresher ? 'e.g. JavaScript, React, SQL' : 'e.g. JavaScript, Node.js, AWS'}
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            {(isProfessional || isHR) && (
              <div className="form-row">
                <div className="form-group anime-item">
                  <label>{isHR ? 'Hiring Company' : 'Company'}</label>
                  <input 
                    type="text"
                    name="company"
                    placeholder={isHR ? 'Your hiring organization' : 'Where do you work?'}
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group anime-item">
                  <label>{isHR ? 'Focus Area' : 'Domain'}</label>
                  <input 
                    type="text"
                    name="domain"
                    placeholder={isHR ? 'e.g. Talent Acquisition' : 'e.g. Backend Engineering'}
                    value={formData.domain}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group anime-item" style={{ marginBottom: '32px' }}>
              <label>{isFresher ? 'Resume or Portfolio Link' : 'Resume Drive Link / URL'}</label>
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
        </TiltCard>
      </div>
    </>
  )
}

export default Profile
