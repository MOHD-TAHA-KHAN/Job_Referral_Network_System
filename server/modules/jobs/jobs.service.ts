import User from '../../models/pg/user';
import Job from '../../models/pg/job';

import {  Op, WhereOptions, fn, col  } from 'sequelize';
import { sequelize } from '../../config/db';

export interface CreateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  requiredSkills: string[];
  domain: string;
  salaryMin?: number;
  salaryMax?: number;
  createdBy: string;
}

export interface GetJobsQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  company?: string;
  location?: string;
  domain?: string;
  skills?: string[];
}

const createJob = async ({ title, description, company, location, requiredSkills, domain, salaryMin, salaryMax, createdBy }: CreateJobDTO) => {
  // Validate that the creator is an HR
  const creator: any = await User.findByPk(createdBy)
  if (!creator || creator.role !== 'HR') {
    throw new Error('Only HR users can create jobs')
  }

  const job = await Job.create({
    title,
    description,
    company,
    location,
    requiredSkills,
    domain,
    salaryMin,
    salaryMax,
    createdBy
  })

  return job
}

const getAllJobs = async ({ page = 1, limit = 10, search, company, location, domain, skills }: GetJobsQuery) => {
  const pageNum = typeof page === 'string' ? parseInt(page) : page;
  const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
  const offset = (pageNum - 1) * limitNum;

  let whereClause: any = {}

  // Add search filters
  if (search) {
    whereClause = {
      ...whereClause,
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ]
    }
  }

  if (company) {
    whereClause.company = { [Op.iLike]: `%${company}%` }
  }

  if (location) {
    whereClause.location = { [Op.iLike]: `%${location}%` }
  }

  if (domain) {
    whereClause.domain = { [Op.iLike]: `%${domain}%` }
  }

  if (skills && skills.length > 0) {
    // Find jobs that have at least one matching skill
    whereClause.requiredSkills = {
      [Op.overlap]: skills // PostgreSQL array overlap operator
    }
  }

  const { count, rows } = await Job.findAndCountAll({
    where: whereClause,
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'company']
    }],
    limit: limitNum,
    offset,
    order: [['createdAt', 'DESC']]
  })

  return {
    jobs: rows,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(count / limitNum)
    }
  }
}

const getJobById = async (id: string) => {
  const job = await Job.findByPk(id, {
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'email', 'company']
    }]
  })

  if (!job) {
    throw new Error('Job not found')
  }

  return job
}

const updateJob = async (id: string, updates: Partial<CreateJobDTO>, userId: string) => {
  const job = await Job.findByPk(id)
  if (!job) {
    throw new Error('Job not found')
  }

  // Check if user is the creator or an HR
  const user: any = await User.findByPk(userId)
  if ((job as any).createdBy !== userId && user.role !== 'HR') {
    throw new Error('Unauthorized to update this job')
  }

  // Update allowed fields
  const allowedFields: (keyof CreateJobDTO)[] = ['title', 'description', 'company', 'location', 'requiredSkills', 'domain', 'salaryMin', 'salaryMax']
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      (job as any)[field] = updates[field]
    }
  })

  await job.save()
  return job
}

const deleteJob = async (id: string, userId: string) => {
  const job = await Job.findByPk(id)
  if (!job) {
    throw new Error('Job not found')
  }

  // Check if user is the creator or an HR
  const user: any = await User.findByPk(userId)
  if ((job as any).createdBy !== userId && user.role !== 'HR') {
    throw new Error('Unauthorized to delete this job')
  }

  await job.destroy()
  return { message: 'Job deleted successfully' }
}

const getJobsByCreator = async (creatorId: string) => {
  return await Job.findAll({
    where: { createdBy: creatorId },
    order: [['createdAt', 'DESC']]
  })
}

const getJobFilters = async () => {
  const companies = await Job.findAll({
    attributes: [
      [fn('DISTINCT', col('company')), 'company']
    ],
    where: { company: { [Op.not]: null } }
  });

  const locations = await Job.findAll({
    attributes: [
      [fn('DISTINCT', col('location')), 'location']
    ],
    where: { location: { [Op.not]: null } }
  });

  const [skillsResult] = await sequelize.query(`
    SELECT DISTINCT unnest("requiredSkills") as skill
    FROM "Jobs"
    WHERE "requiredSkills" IS NOT NULL
  `);

  return {
    companies: companies.map((c: any) => c.dataValues.company || (c as any).company).filter(Boolean),
    locations: locations.map((l: any) => l.dataValues.location || (l as any).location).filter(Boolean),
    skills: (skillsResult as any[]).map((s: any) => s.skill).filter(Boolean)
  };
}

export { createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByCreator,
  getJobFilters
 };