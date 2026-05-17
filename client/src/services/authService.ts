import { api } from '../utils/api';

type AuthResponse = {
  user: any;
  token: string;
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;
    localStorage.setItem('authToken', token);
    return { user, token };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
  },

  async getMe(): Promise<any> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async handleGoogleCallback(token: string): Promise<AuthResponse> {
    // Validate the token before storage
    try {
      // Validate token with the backend
      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Store only after successful validation
      localStorage.setItem('authToken', token);
      // Get user info with the new token
      const user = await this.getMe();
      return { user, token };
    } catch (error) {
      // Clear any existing invalid token
      localStorage.removeItem('authToken');
      throw new Error('Invalid OAuth token provided');
    }
  },
};