import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/auth.store'

const Dashboard = () => {
  const user = useAuthStore(state => state.user)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/profile/stats')
        setStats(data.stats)
      } catch (err) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchStats()
    }
  }, [user])

  if (loading || !stats || !user) {
    return null; // Do not render until stats are loaded
  }

  const isFresher = user.role === 'FRESHER'

  return (
    <div className="bento-card bento-full stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', background: 'transparent', padding: 0, boxShadow: 'none' }}>
      {isFresher ? (
        <>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Sent</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', margin: '10px 0' }}>{stats.totalSent}</p>
          </div>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid var(--status-success)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Accepted</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--status-success)', margin: '10px 0' }}>{stats.accepted}</p>
          </div>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid var(--status-error)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Rejected</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--status-error)', margin: '10px 0' }}>{stats.rejected}</p>
          </div>
        </>
      ) : (
        <>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Received</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', margin: '10px 0' }}>{stats.totalReceived}</p>
          </div>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid var(--status-warning)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Pending</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--status-warning)', margin: '10px 0' }}>{stats.pending}</p>
          </div>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Completed</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: '10px 0' }}>{stats.completed}</p>
          </div>
          <div className="bento-card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid var(--status-success)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Success Rate</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--status-success)', margin: '10px 0' }}>
              {stats.successRate ? Math.round(stats.successRate) : 0}%
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
