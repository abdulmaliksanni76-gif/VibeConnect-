const User = require('../models/User');
const { upload } = require('../config/cloudinary');

exports.updateProfile = [
  upload.single('profilePic'),
  async (req, res) => {
    try {
      const { username, status } = req.body;
      const updateData = { username, status };

      if (req.file) {
        updateData.photoUrl = req.file.path; // Cloudinary URL
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        updateData, 
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
];