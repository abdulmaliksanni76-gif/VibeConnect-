const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => ({

//         folder: "vibeconnect",

//         resource_type: "auto",

//         allowed_formats: [
//             "jpg",
//             "jpeg",
//             "png",
//             "webp",

//             "mp4",
//             "mov",
//             "avi",
//             "mkv",

//             "mp3",
//             "wav",
//             "ogg",
//             "webm",

//             "pdf",
//             "doc",
//             "docx",
//             "xls",
//             "xlsx",
//             "ppt",
//             "pptx",
//             "txt",
//             "zip"
//         ]

//     })
// });

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "vibeconnect",
        resource_type: "auto"
    })
});

const upload = multer({
  storage
});



module.exports = { upload, cloudinary };