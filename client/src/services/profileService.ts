import { api } from './api';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role?: string;
  bio?: string;
  company?: string;
  position?: string;
  skills?: string[];
  education?: string;
  resumeUrl?: string;
  profilePicture?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export const profileService = {
  async getMyProfile(): Promise<Profile> {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await api.patch('/profile', data);
    return response.data;
  },

  async uploadResume(file: File): Promise<{ resumeUrl: string }> {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/files/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get('/profile/stats');
    return response.data;
  },

  async getUsers(role?: string): Promise<Profile[]> {
    const response = await api.get('/profile/users', { params: { role } });
    return response.data;
  },
};
