import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/auth.store'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile/Profile'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/profile" /> // default route for now
  return children
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
