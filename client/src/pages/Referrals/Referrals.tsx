import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Referral } from '../../types'

const Referrals = () => {
  const [sentReferrals, setSentReferrals] = useState<Referral[]>([])
  const [receivedReferrals, setReceivedReferrals] = useState<Referral[]>([])
  const [activeTab, setActiveTab] = useState('sent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    try {
      setLoading(true)
      const [sentRes, receivedRes] = await Promise.all([
        api.get('/referrals/my-referrals?type=sent'),
        api.get('/referrals/my-referrals?type=received')
      ])
      setSentReferrals(sentRes.data.referrals)
      setReceivedReferrals(receivedRes.data.referrals)
    } catch (error) {
      console.error('Failed to load referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReferralStatus = async (referralId: string | number, status: string, message = '') => {
    try {
      await api.patch(`/referrals/${referralId}/status`, {
        status,
        responseMessage: message
      })
      loadReferrals() // Refresh data
    } catch (error) {
      console.error('Failed to update referral:', error)
      alert((error as any).response?.data?.message || 'Failed to update referral')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'status-pending'
      case 'ACCEPTED': return 'status-accepted'
      case 'REJECTED': return 'status-rejected'
      case 'COMPLETED': return 'status-completed'
      default: return 'status-default'
    }
  }

  if (loading) {
    return <div className="loading">Loading referrals...</div>
  }

  return (
    <div className="referrals-page">
      <div className="page-header">
        <h1>My Referrals</h1>
        <p>Manage your referral requests and responses</p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'sent' ? 'active' : ''}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({sentReferrals.length})
        </button>
        <button
          className={activeTab === 'received' ? 'active' : ''}
          onClick={() => setActiveTab('received')}
        >
          Received ({receivedReferrals.length})
        </button>
      </div>

      {activeTab === 'sent' && (
        <div className="referrals-list">
          {sentReferrals.length === 0 ? (
            <div className="empty-state">
              <p>You haven't sent any referral requests yet.</p>
            </div>
          ) : (
            sentReferrals.map(referral => (
              <div key={referral.id} className="referral-card">
                <div className="card-header">
                  <h3>{referral.job.title}</h3>
                  <span className={`status ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>To:</strong> {referral.referrer.name} ({referral.referrer.company})</p>
                  <p><strong>Company:</strong> {referral.job.company}</p>
                  <p><strong>Location:</strong> {referral.job.location}</p>
                  {referral.message && (
                    <p><strong>Your Message:</strong> {referral.message}</p>
                  )}
                  {referral.responseMessage && (
                    <div className="response-message">
                      <strong>Response:</strong> {referral.responseMessage}
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  <small>Requested on {new Date(referral.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'received' && (
        <div className="referrals-list">
          {receivedReferrals.length === 0 ? (
            <div className="empty-state">
              <p>You haven't received any referral requests yet.</p>
            </div>
          ) : (
            receivedReferrals.map(referral => (
              <div key={referral.id} className="referral-card">
                <div className="card-header">
                  <h3>{referral.job.title}</h3>
                  <span className={`status ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>From:</strong> {referral.requester.name}</p>
                  <p><strong>Company:</strong> {referral.job.company}</p>
                  <p><strong>Location:</strong> {referral.job.location}</p>
                  {referral.message && (
                    <div className="requester-message">
                      <strong>Message:</strong> {referral.message}
                    </div>
                  )}
                  {referral.responseMessage && (
                    <div className="response-message">
                      <strong>Your Response:</strong> {referral.responseMessage}
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  {referral.status === 'PENDING' && (
                    <div className="action-buttons">
                      <button
                        className="btn-accept"
                        onClick={() => {
                          const message = prompt('Add a response message (optional):')
                          updateReferralStatus(referral.id, 'ACCEPTED', message || 'Happy to help!')
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => {
                          const message = prompt('Add a response message (optional):')
                          updateReferralStatus(referral.id, 'REJECTED', message || 'Sorry, cannot refer at this time.')
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {referral.status === 'ACCEPTED' && (
                    <button
                      className="btn-complete"
                      onClick={() => {
                        const message = prompt('Add completion message (optional):')
                        updateReferralStatus(referral.id, 'COMPLETED', message || 'Referral submitted successfully!')
                      }}
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
                <div className="card-footer">
                  <small>Requested on {new Date(referral.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Referrals