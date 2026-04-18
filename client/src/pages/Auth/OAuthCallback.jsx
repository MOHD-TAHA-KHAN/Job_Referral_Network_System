import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../../store/auth.store'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const updateUser = useAuthStore(state => state.updateUser)

  useEffect(() => {
    if (!token) {
      toast.error('Authentication failed')
      return navigate('/login')
    }

    const authenticateGoogleUser = async () => {
      try {
        // Save the access token to memory
        setAccessToken(token)
        
        // Fetch the user's profile details using the new token
        const { data } = await api.get('/profile')
        
        // Tell Zustand that we are fully authenticated and save the user data
        useAuthStore.setState({ user: data.profile, isAuthenticated: true })
        
        toast.success('Successfully logged in with Google!')
        navigate('/profile')
      } catch (error) {
        console.error(error)
        toast.error('Could not fetch user profile')
        navigate('/login')
      }
    }

    authenticateGoogleUser()
  }, [token, navigate, setAccessToken])

  return (
    <div className="auth-page">
      <div className="glass-container auth-card" style={{ textAlign: 'center' }}>
        <h2>Authenticating...</h2>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  )
}

export default OAuthCallback
