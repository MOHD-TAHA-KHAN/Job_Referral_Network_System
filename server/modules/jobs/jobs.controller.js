const jobsService = require('./jobs.service')

const createJob = async (req, res) => {
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
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

const getAllJobs = async (req, res) => {
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
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      company,
      location,
      domain,
      skills: parsedSkills
    })

    res.json({
      success: true,
      ...result
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching jobs'
    })
  }
}

const getJobById = async (req, res) => {
  try {
    const job = await jobsService.getJobById(req.params.id)
    res.json({
      success: true,
      job
    })
  } catch (err) {
    const statusCode = err.message === 'Job not found' ? 404 : 500
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const updateJob = async (req, res) => {
  try {
    const job = await jobsService.updateJob(req.params.id, req.body, req.user.id)
    res.json({
      success: true,
      job,
      message: 'Job updated successfully'
    })
  } catch (err) {
    const statusCode = err.message.includes('Unauthorized') ? 403 :
                      err.message === 'Job not found' ? 404 : 400
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const deleteJob = async (req, res) => {
  try {
    const result = await jobsService.deleteJob(req.params.id, req.user.id)
    res.json({
      success: true,
      message: result.message
    })
  } catch (err) {
    const statusCode = err.message.includes('Unauthorized') ? 403 :
                      err.message === 'Job not found' ? 404 : 400
    res.status(statusCode).json({
      success: false,
      message: err.message
    })
  }
}

const getMyJobs = async (req, res) => {
  try {
    const jobs = await jobsService.getJobsByCreator(req.user.id)
    res.json({
      success: true,
      jobs
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching your jobs'
    })
  }
}

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
}