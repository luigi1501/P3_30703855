const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configurar Cloudinary con variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Storage: sube directo a Cloudinary (carpeta "keyboards-store/products")
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'keyboards-store/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [
            { width: 800, height: 800, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
        ]
    }
});

// Multer configurado con Cloudinary storage (máx. 5MB)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { cloudinary, upload };
