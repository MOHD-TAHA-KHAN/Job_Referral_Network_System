import express from 'express';
const router = express.Router()
import {  
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
} from './profile.controller';
import {  protect  } from '../../middleware/auth';

// All profile routes are protected
router.use(protect)

router.get('/', getProfile)
router.patch('/', updateProfile)

// Get profile statistics (requires authentication)
router.get('/stats', getStats)

// Get users with specific roles (requires authentication)
router.get('/users', getUsers)

// Experience routes
router.get('/experiences', getExperiences)
router.post('/experiences', createExperience)
router.put('/experiences/:id', updateExperience)
router.delete('/experiences/:id', deleteExperience)

// Project routes
router.get('/projects', getProjects)
router.post('/projects', createProject)
router.put('/projects/:id', updateProject)
router.delete('/projects/:id', deleteProject)

export default router
;