import { useState, useEffect } from 'react'
import api from '../../services/api'
import { User } from '../../types'

interface ReferralRequestProps {
  jobId: string | number;
  onRequestSent?: () => void;
}

const ReferralRequest = ({ jobId, onRequestSent }: ReferralRequestProps) => {
  const [professionals, setProfessionals] = useState<User[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<string>('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadProfessionals()
    }
  }, [isOpen])

  const loadProfessionals = async () => {
    try {
      setLoading(true)
      // Get all users with role PROFESSIONAL or HR
      const response = await api.get('/profile/users?role=PROFESSIONAL&role=HR')
      setProfessionals(response.data.users)
    } catch (error) {
      console.error('Failed to load professionals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProfessional || !message.trim()) return

    setIsSubmitting(true)
    try {
      await api.post('/referrals', {
        jobId,
        referrerId: selectedProfessional,
        message: message.trim()
      })

      alert('Referral request sent successfully!')
      setSelectedProfessional('')
      setMessage('')
      setIsOpen(false)

      if (onRequestSent) {
        onRequestSent()
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send referral request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="referral-request">
      <button
        className="btn-request-referral"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Cancel Request' : 'Request Referral'}
      </button>

      {isOpen && (
        <div className="referral-form-overlay">
          <div className="referral-form">
            <h3>Request Referral</h3>

            {loading ? (
              <div className="loading">Loading professionals...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="professional">Select a Professional or HR:</label>
                  <select
                    id="professional"
                    value={selectedProfessional}
                    onChange={(e) => setSelectedProfessional(e.target.value)}
                    required
                  >
                    <option value="">Choose someone to refer you...</option>
                    {professionals.map(pro => (
                      <option key={pro.id} value={pro.id}>
                        {pro.name} - {pro.company || 'N/A'} ({pro.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Personal Message:</label>
                  <textarea
                    id="message"
                    placeholder="Explain why you'd be a good fit for this position and why you're asking this person for a referral..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting || !selectedProfessional || !message.trim()}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferralRequest