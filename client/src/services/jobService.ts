import { api } from './api';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  requirements?: string;
  experienceLevel?: string;
  jobType?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  experienceLevel?: string;
  company?: string;
}

export const jobService = {
  async getAllJobs(filters?: JobFilters): Promise<Job[]> {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },

  async getMyJobs(): Promise<Job[]> {
    const response = await api.get('/jobs/user/my-jobs');
    return response.data;
  },

  async getJobFiltersMetadata(): Promise<any> {
    const response = await api.get('/jobs/metadata/filters');
    return response.data;
  },
};
