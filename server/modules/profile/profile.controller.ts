// @ts-nocheck
import User from '../../models/pg/user';
import Referral from '../../models/pg/referral';
import Experience from '../../models/pg/experience';
import Project from '../../models/pg/project';


import {  Op  } from 'sequelize';

const getProfile = async (req: any, res: any) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const experiences = await Experience.findAll({ where: { userId: req.user.id }, order: [['startDate', 'DESC']] })
    const projects = await Project.findAll({ where: { userId: req.user.id }, order: [['startDate', 'DESC']] })

    res.json({ success: true, profile: user, experiences, projects })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' })
  }
}

// Experience endpoints
const getExperiences = async (req: any, res: any) => {
  try {
    const experiences = await Experience.findAll({ where: { userId: req.user.id }, order: [['startDate', 'DESC']] })
    res.json({ success: true, experiences })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching experiences' })
  }
}

const createExperience = async (req: any, res: any) => {
  try {
    const experience = await Experience.create({
      userId: req.user.id,
      ...req.body
    })
    res.json({ success: true, experience })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error creating experience' })
  }
}

const updateExperience = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const experience = await Experience.findOne({ where: { id, userId: req.user.id } })
    if (!experience) return res.status(404).json({ message: 'Experience not found' })
    await experience.update(req.body)
    res.json({ success: true, experience })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error updating experience' })
  }
}

const deleteExperience = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const experience = await Experience.findOne({ where: { id, userId: req.user.id } })
    if (!experience) return res.status(404).json({ message: 'Experience not found' })
    await experience.destroy()
    res.json({ success: true, message: 'Experience deleted' })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error deleting experience' })
  }
}

// Project endpoints
const getProjects = async (req: any, res: any) => {
  try {
    const projects = await Project.findAll({ where: { userId: req.user.id }, order: [['startDate', 'DESC']] })
    res.json({ success: true, projects })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching projects' })
  }
}

const createProject = async (req: any, res: any) => {
  try {
    const project = await Project.create({
      userId: req.user.id,
      ...req.body
    })
    res.json({ success: true, project })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error creating project' })
  }
}

const updateProject = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const project = await Project.findOne({ where: { id, userId: req.user.id } })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    await project.update(req.body)
    res.json({ success: true, project })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error updating project' })
  }
}

const deleteProject = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const project = await Project.findOne({ where: { id, userId: req.user.id } })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    await project.destroy()
    res.json({ success: true, message: 'Project deleted' })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error deleting project' })
  }
}

const updateProfile = async (req: any, res: any) => {
  try {
    const { company, domain, skills, resumeUrl, bio, position, education, linkedinUrl, name } = req.body
    
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Update fields
    if (name !== undefined) user.name = name === '' ? user.name : name
    if (company !== undefined) user.company = company === '' ? null : company
    if (domain !== undefined) user.domain = domain === '' ? null : domain
    if (skills !== undefined) user.skills = skills === '' ? null : skills
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl === '' ? null : resumeUrl
    if (bio !== undefined) user.bio = bio === '' ? null : bio
    if (position !== undefined) user.position = position === '' ? null : position
    if (education !== undefined) user.education = education === '' ? null : education
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl === '' ? null : linkedinUrl

    await user.save()

    res.json({ success: true, profile: user })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error updating profile' })
  }
}

const getUsers = async (req: any, res: any) => {
  try {
    const { role } = req.query
    const whereClause = {}

    if (role) {
      // Handle multiple roles (role=PROFESSIONAL&role=HR)
      const roles = Array.isArray(role) ? role : [role]
      whereClause.role = { [Op.in]: roles }
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'company', 'domain', 'role', 'referralSuccessRate'],
      order: [['name', 'ASC']]
    })

    res.json({ success: true, users })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching users' })
  }
}

const getStats = async (req: any, res: any) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    let stats: any = {}

    if (user.role === 'FRESHER') {
      const totalSent = await Referral.count({ where: { requesterId: user.id } })
      const accepted = await Referral.count({ where: { requesterId: user.id, status: 'ACCEPTED' } })
      const rejected = await Referral.count({ where: { requesterId: user.id, status: 'REJECTED' } })
      
      stats = { totalSent, accepted, rejected }
    } else {
      // PROFESSIONAL or HR
      const totalReceived = await Referral.count({ where: { referrerId: user.id } })
      const completed = await Referral.count({ where: { referrerId: user.id, status: 'COMPLETED' } })
      const pending = await Referral.count({ where: { referrerId: user.id, status: 'PENDING' } })
      
      stats = { 
        totalReceived, 
        completed, 
        pending,
        successRate: user.referralSuccessRate 
      }
    }

    res.json({ success: true, stats })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' })
  }
}

export { 
  getProfile, 
  updateProfile, 
  getUsers, 
  getStats,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getProjects,
  createProject,
  updateProject,
  deleteProject
};