import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAccessToken: (token) => set({ accessToken: token }),

      login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials)
        set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true })
        return data
      },

      register: async (credentials) => {
        const { data } = await api.post('/auth/register', credentials)
        set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true })
        return data
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (e) {
          console.error(e)
        }
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      updateUser: (updatedData) => set((state) => ({ user: { ...state.user, ...updatedData } }))
    }),
    {
      name: 'auth-storage',
      // only persist user data, access token is memory only
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore
