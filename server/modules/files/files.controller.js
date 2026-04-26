const User = require('../../models/pg/user');

/**
 * @desc    Upload user resume to Cloudinary and save URL to DB
 * @route   POST /api/files/resume
 * @access  Private
 */
const uploadResume = async (req, res) => {
  try {
    // If the file was not uploaded successfully, multer would have thrown an error or file would be undefined
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid PDF file' });
    }

    // req.file.path contains the secure Cloudinary URL
    const resumeUrl = req.file.path;

    // Update the authenticated user's profile with the new resume URL
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resumeUrl = resumeUrl;
    await user.save();

    return res.status(200).json({ 
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl 
    });

  } catch (error) {
    console.error('Resume Upload Error:', error);
    return res.status(500).json({ message: 'Server error during uploading' });
  }
};

module.exports = {
  uploadResume
};
