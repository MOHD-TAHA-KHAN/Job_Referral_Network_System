import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import NetworkBackground from '../../components/NetworkBackground'
import ReferralRequest from '../Referrals/ReferralRequest'
import { Job } from '../../types'

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    company: '',
    skills: '',
    location: ''
  })


  useEffect(() => {
    loadJobs()
  }, [filters])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.company) params.append('company', filters.company)
      if (filters.skills) params.append('skills', filters.skills.split(',').map(s => s.trim()).join(','))
      if (filters.location) params.append('location', filters.location)

      const response = await api.get(`/jobs?${params}`)
      setJobs(response.data.jobs)
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReferralSent = () => {
    toast.success('Referral request sent successfully!')
  }

  if (loading) {
    return (
      <>
        <NetworkBackground />
        <div className="jobs-page">
          <div className="loading">Loading jobs...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <NetworkBackground />

      <div className="jobs-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Job Opportunities</h1>
            <p>Find your next career opportunity and get referrals from professionals</p>
          </div>
          <div className="header-actions">
            <Link to="/referrals" className="btn btn-secondary">My Referrals</Link>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters">
            <input
              type="text"
              name="company"
              placeholder="Filter by company..."
              value={filters.company}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="skills"
              placeholder="Filter by skills (comma separated)..."
              value={filters.skills}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Filter by location..."
              value={filters.location}
              onChange={handleFilterChange}
            />
            <button
              onClick={() => setFilters({ company: '', skills: '', location: '' })}
              className="btn-clear"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <div className="empty-state">
              <p>No jobs found matching your criteria.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="company-badge">{job.company}</span>
                </div>

                <div className="job-details">
                  <p className="location">📍 {job.location}</p>
                  <p className="description">{job.description}</p>

                  <div className="job-meta">
                    <div className="skills">
                      <strong>Skills:</strong> {job.requiredSkills.join(', ')}
                    </div>
                    <div className="domain">
                      <strong>Domain:</strong> {job.domain}
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="salary">
                        <strong>Salary:</strong> ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="job-actions">
                  <ReferralRequest
                    jobId={job.id}
                    onRequestSent={handleReferralSent}
                  />
                </div>

                <div className="job-footer">
                  <small>Posted by {job.creator?.name || 'HR Team'}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Jobs