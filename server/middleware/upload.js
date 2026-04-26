const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'refnet_resumes',
    // PDFs act a bit differently than images in Cloudinary
    resource_type: 'raw', 
    format: async (req, file) => 'pdf',
    allowed_formats: ['pdf']
  },
});

// Create the multer instance with a 5MB limit
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;
