import { api } from './api';

export interface Experience {
  id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
  skills?: string[];
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  githubUrl?: string;
  demoUrl?: string;
  skills?: string[];
  isFromGithub?: boolean;
}

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
  async getMyProfile(): Promise<{ profile: Profile; experiences: Experience[]; projects: Project[] }> {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await api.patch('/profile', data);
    return response.data.profile;
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
    return response.data.stats;
  },

  async getUsers(role?: string): Promise<Profile[]> {
    const response = await api.get('/profile/users', { params: { role } });
    return response.data.users || [];
  },

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    const response = await api.get('/profile/experiences');
    return response.data.experiences;
  },

  async createExperience(data: Omit<Experience, 'id' | 'userId'>): Promise<Experience> {
    const response = await api.post('/profile/experiences', data);
    return response.data.experience;
  },

  async updateExperience(id: string, data: Partial<Omit<Experience, 'id' | 'userId'>>): Promise<Experience> {
    const response = await api.put(`/profile/experiences/${id}`, data);
    return response.data.experience;
  },

  async deleteExperience(id: string): Promise<void> {
    await api.delete(`/profile/experiences/${id}`);
  },

  // Project methods
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/profile/projects');
    return response.data.projects;
  },

  async createProject(data: Omit<Project, 'id' | 'userId'>): Promise<Project> {
    const response = await api.post('/profile/projects', data);
    return response.data.project;
  },

  async updateProject(id: string, data: Partial<Omit<Project, 'id' | 'userId'>>): Promise<Project> {
    const response = await api.put(`/profile/projects/${id}`, data);
    return response.data.project;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/profile/projects/${id}`);
  },
};
