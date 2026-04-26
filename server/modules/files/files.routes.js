const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');
const { uploadResume } = require('./files.controller');
const { protect } = require('../../middleware/auth');

// Note: Using protect middleware to ensure only logged in users can upload
router.post('/resume', protect, upload.single('resume'), uploadResume);

module.exports = router;
