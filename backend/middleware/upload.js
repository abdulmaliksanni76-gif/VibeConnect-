// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage });
// module.exports = upload;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.post(
    "/upload",
    auth,
    upload.single("file"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        res.json({
            filePath: req.file.path,
            fileName: req.file.originalname,
            fileType: req.file.mimetype
        });

    }
);

module.exports = router;