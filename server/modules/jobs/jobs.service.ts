// @ts-nocheck
import User from '../../models/pg/user';
import Job from '../../models/pg/job';

import {  Op  } from 'sequelize';

const createJob = async ({ title, description, company, location, requiredSkills, domain, salaryMin, salaryMax, createdBy }) => {
  // Validate that the creator is an HR
  const creator = await User.findByPk(createdBy)
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

const getAllJobs = async ({ page = 1, limit = 10, search, company, location, domain, skills }) => {
  const offset = (page - 1) * limit

  let whereClause = {}

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
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })

  return {
    jobs: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  }
}

const getJobById = async (id) => {
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

const updateJob = async (id, updates, userId) => {
  const job = await Job.findByPk(id)
  if (!job) {
    throw new Error('Job not found')
  }

  // Check if user is the creator or an HR
  const user = await User.findByPk(userId)
  if (job.createdBy !== userId && user.role !== 'HR') {
    throw new Error('Unauthorized to update this job')
  }

  // Update allowed fields
  const allowedFields = ['title', 'description', 'company', 'location', 'requiredSkills', 'domain', 'salaryMin', 'salaryMax']
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      job[field] = updates[field]
    }
  })

  await job.save()
  return job
}

const deleteJob = async (id, userId) => {
  const job = await Job.findByPk(id)
  if (!job) {
    throw new Error('Job not found')
  }

  // Check if user is the creator or an HR
  const user = await User.findByPk(userId)
  if (job.createdBy !== userId && user.role !== 'HR') {
    throw new Error('Unauthorized to delete this job')
  }

  await job.destroy()
  return { message: 'Job deleted successfully' }
}

const getJobsByCreator = async (creatorId) => {
  return await Job.findAll({
    where: { createdBy: creatorId },
    order: [['createdAt', 'DESC']]
  })
}

export { createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByCreator
 };