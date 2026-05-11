import { create } from 'zustand';
import { authService, type AuthUser } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login({ email, password });
      localStorage.setItem('authToken', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  signup: async (name, email, password, role = 'fresher') => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.signup({ name, email, password, role: role as 'fresher' | 'professional' });
      localStorage.setItem('authToken', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Signup failed. Please try again.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    localStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  initAuth: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('authToken');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

// Selector helpers
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
