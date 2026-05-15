import { api } from './api';

export interface Referral {
  id: string;
  jobId: string;
  requesterId: string;
  referrerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt?: string;
  job?: {
    title: string;
    company: string;
    location?: string;
  };
  requester?: {
    id: string;
    name: string;
    email: string;
  };
  referrer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ReferralMatch {
  userId: string;
  name: string;
  company: string;
  role: string;
  matchScore: number;
  skills?: string[];
  yearsAtCompany?: number;
  totalReferrals?: number;
}

export const referralService = {
  async getMyReferrals(): Promise<Referral[]> {
    const response = await api.get('/referrals/my-referrals');
    return response.data.referrals || [];
  },

  async getReferralById(id: string): Promise<Referral> {
    const response = await api.get(`/referrals/${id}`);
    return response.data;
  },

  async createReferral(data: { jobId: string; referrerId: string; message?: string }): Promise<Referral> {
    const response = await api.post('/referrals', data);
    return response.data;
  },

  async updateReferralStatus(id: string, status: 'accepted' | 'rejected'): Promise<Referral> {
    const response = await api.patch(`/referrals/${id}/status`, { status });
    return response.data;
  },

  async getReferralsForJob(jobId: string): Promise<Referral[]> {
    const response = await api.get(`/referrals/job/${jobId}`);
    return response.data;
  },

  async getMatchesForJob(jobId: string): Promise<ReferralMatch[]> {
    const response = await api.get(`/match/${jobId}`);
    return response.data;
  },

  // Referral inbox (for professionals who received requests)
  async getReferralInbox(): Promise<Referral[]> {
    const response = await api.get('/referrals/my-referrals');
    return response.data.referrals || [];
  },
};
