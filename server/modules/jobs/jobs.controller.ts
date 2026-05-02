import { Request, Response } from 'express';
import * as jobsService from './jobs.service';

// Interface for authenticated requests
export interface AuthRequest extends Request {
  user?: any; // Replace with proper User interface if available
}

const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user.id
    }

    const job = await jobsService.createJob(jobData)
    res.status(201).json({
      success: true,
      job,
      message: 'Job created successfully'
    })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

const getAllJobs = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      company,
      location,
      domain,
      skills
    } = req.query

    // Parse skills if it's a string
    let parsedSkills = skills
    if (typeof skills === 'string') {
      try {
        parsedSkills = JSON.parse(skills)
      } catch {
        parsedSkills = skills.split(',').map(s => s.trim())
      }
    }

    const result = await jobsService.getAllJobs({
      page: typeof page === 'string' ? parseInt(page) : (page as number),
      limit: typeof limit === 'string' ? parseInt(limit) : (limit as number),
      search: search as string,
      company: company as string,
      location: location as string,
      domain: domain as string,
      skills: parsedSkills as string[]
    })

    res.json({
      success: true,
      ...result
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching jobs'
    })
  }
}

const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await jobsService.getJobById(req.params.id as string)
    res.json({
      success: true,
      job
    })
  } catch (err: any) {
    const statusCode = err.message === 'Job not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await jobsService.updateJob(req.params.id as string, req.body, req.user.id)
    res.json({
      success: true,
      job,
      message: 'Job updated successfully'
    })
  } catch (err: any) {
    const statusCode = err.message.includes('Unauthorized') ? 403 :
                      err.message === 'Job not found' ? 404 : 400
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const result = await jobsService.deleteJob(req.params.id as string, req.user.id)
    res.json({
      success: true,
      message: result.message
    })
  } catch (err: any) {
    const statusCode = err.message.includes('Unauthorized') ? 403 :
                      err.message === 'Job not found' ? 404 : 400
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await jobsService.getJobsByCreator(req.user.id)
    res.json({
      success: true,
      jobs
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching your jobs'
    })
  }
}

const getJobFiltersMetadata = async (req: Request, res: Response) => {
  try {
    const filters = await jobsService.getJobFilters()
    res.json({
      success: true,
      filters
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching job filters metadata'
    })
  }
}

export { createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobFiltersMetadata
 };