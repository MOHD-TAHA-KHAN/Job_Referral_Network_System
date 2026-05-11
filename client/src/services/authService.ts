import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: 'fresher' | 'professional';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors
    }
  },

  async getMe(): Promise<AuthUser> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Google OAuth
  async getGoogleAuthUrl(): Promise<string> {
    // This should be constructed on frontend or returned from backend
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}/auth/google`;
  },

  async handleGoogleCallback(token: string): Promise<AuthResponse> {
    // Store the token received from Google OAuth callback
    localStorage.setItem('authToken', token);
    // Get user info with the new token
    const user = await this.getMe();
    return { user, token };
  },
};
