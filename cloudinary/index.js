// dependencies for working with cloudinary to store images and retreive URL, multer is for parsing multipart/form-data
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder: 'YelpCamp',
    allowedFormats: ['jpeg','png','jpg']
}
});

module.exports = {
    cloudinary,
    storage
}