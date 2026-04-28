export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  profilePicUrl?: string;
  resumeUrl?: string;
  company?: string;
  domain?: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  domain: string;
  salaryMin?: number;
  salaryMax?: number;
  creator?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Referral {
  id: string | number;
  job: Job;
  requester: User;
  referrer: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt?: string;
}
