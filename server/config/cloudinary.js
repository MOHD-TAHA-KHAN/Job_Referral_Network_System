const cloudinary = require('cloudinary').v2;

// Cloudinary automatically picks up the CLOUDINARY_URL from your .env file
// You can use this exported instance anywhere in your app

module.exports = cloudinary;
