// @ts-nocheck
import multer from 'multer';
import {  CloudinaryStorage  } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

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

export default upload;
