import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/auth.store'
import api, { uploadResume } from '../../services/api'
import NetworkBackground from '../../components/NetworkBackground'
import { User } from '../../types'

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
  const [uploadingResume, setUploadingResume] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0] as any)
    }
  }

  const handleResumeUpload = async () => {
    // If the file is somehow not selected
    if (!selectedFile) return;
    setUploadingResume(true)
    const formDataObj = new FormData()
    formDataObj.append('resume', selectedFile)

    try {
      const { data } = await uploadResume(formDataObj)
      setFormData(prev => ({ ...prev, resumeUrl: data.resumeUrl }))
      if (user) {
        updateUser({ ...user, resumeUrl: data.resumeUrl })
      }
      toast.success('Resume uploaded successfully!')
      setSelectedFile(null)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploadingResume(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!user) return;
      const payload: Partial<User> = {
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      }
      // ONLY send resumeUrl if it exists and differs, avoiding the "" error bug we discovered.
      if (formData.resumeUrl) {
         payload.resumeUrl = formData.resumeUrl
      }
      
      if (user.role === 'PROFESSIONAL' || user.role === 'HR') {
        if (formData.company) payload.company = formData.company
        if (formData.domain) payload.domain = formData.domain
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

  if (!user) return null;

  const isFresher = user.role === 'FRESHER'
  const isProfessional = user.role === 'PROFESSIONAL'
  const isHR = user.role === 'HR'

  return (
    <>
      <NetworkBackground />
      <div className="dashboard-page profile-page fade-in">
        <div className="dashboard-header">
          <div>
            <h1 style={{fontSize: '2.5rem', marginBottom: '8px'}}>{user.name}</h1>
            <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
          </div>
          <div className="header-actions">
            {isHR ? (
              <Link to="/jobs" className="btn btn-secondary">Manage Jobs</Link>
            ) : (
              <Link to="/jobs" className="btn btn-secondary">Browse Jobs</Link>
            )}
            <Link to="/referrals" className="btn btn-secondary">My Referrals</Link>
            <button onClick={logout} className="btn btn-logout">Logout</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-bento">
           
           <div className="bento-card bento-full">
              <h2>Overview</h2>
              <div className="info-alert">
                 {isFresher ? 'As a Fresher, your profile should highlight skills, learning goals, and why you need a referral. Upload your resume so industry professionals can easily review it.'
                  : isProfessional ? 'As an IT Professional, your profile shows your current company, domain expertise, and referral readiness. Stay updated to help freshers effectively.'
                  : 'As an HR, you manage jobs and coordinate referrals directly. Ensure your company info is correct so candidates recognize you.'}
              </div>
           </div>

           <div className="bento-card">
              <h2>Skills Box</h2>
              <div className="form-group">
                 <label>Core Keywords (comma separated)</label>
                 <input 
                   type="text"
                   name="skills"
                   placeholder={isFresher ? 'Java, React, SQL...' : 'System Design, Node.js, AWS...'}
                   value={formData.skills}
                   onChange={handleChange}
                 />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '10px' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
           </div>

           {(isProfessional || isHR) && (
              <div className="bento-card">
                 <h2>Professional Info</h2>
                 <div className="form-group">
                   <label>{isHR ? 'Hiring Company' : 'Company'}</label>
                   <input 
                     type="text"
                     name="company"
                     placeholder={isHR ? 'Your organization' : 'Where do you work?'}
                     value={formData.company}
                     onChange={handleChange}
                   />
                 </div>
                 <div className="form-group" style={{ marginBottom: 0 }}>
                   <label>{isHR ? 'Focus Area' : 'Domain'}</label>
                   <input 
                     type="text"
                     name="domain"
                     placeholder={isHR ? 'Talent Acquisition' : 'Backend Engineering'}
                     value={formData.domain}
                     onChange={handleChange}
                   />
                 </div>
              </div>
           )}

           <div className="bento-card bento-full">
              <h2>Resume Document</h2>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Upload or Replace Active Resume (PDF only)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ flex: 1, padding: '12px', background: 'var(--surface-hover)', borderRadius: '8px', color: '#fff', border: '1px solid var(--border)' }}
                  />
                  
                  {selectedFile && (
                    <button 
                      type="button" 
                      onClick={handleResumeUpload} 
                      disabled={uploadingResume}
                      className="btn btn-primary"
                    >
                      {uploadingResume ? 'Uploading...' : 'Upload Selected File'}
                    </button>
                  )}
                  
                  {formData.resumeUrl && !selectedFile && (
                    <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      View Active Resume
                    </a>
                  )}
                </div>
              </div>
           </div>

        </form>
      </div>
    </>
  )
}

export default Profile
