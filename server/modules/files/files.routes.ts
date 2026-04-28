import express from 'express';
const router = express.Router();
import upload from '../../middleware/upload';
import {  uploadResume  } from './files.controller';
import {  protect  } from '../../middleware/auth';

// Note: Using protect middleware to ensure only logged in users can upload
router.post('/resume', protect, upload.single('resume'), uploadResume);

export default router;
