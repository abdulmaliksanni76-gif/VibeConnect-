const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 
const userController = require('../controllers/userController');

// router.get('/search', async (req, res) => {
//   try {
//     const email = req.query.email?.trim().toLowerCase();
//     if (!email) return res.status(400).json({ message: "Email required" });

//     const user = await User.findOne({ 
//       email: { $regex: new RegExp(`^${email}$`, 'i') } 
//     }).select('-password');

//     if (!user) return res.status(404).json({ message: "User not found" });
    
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/search", auth, async (req, res) => {

    try {

        const email = req.query.email?.trim();

        if (!email){

            return res.json([]);

        }

        const users = await User.find({

            _id: { $ne: req.user.id },

            email: {
                $regex: email,
                $options: "i"
            }

        })
        .select("-password")
        .limit(20);

        res.json(users);

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

// REMOVED the '/find' route as it was causing the 400 Bad Request error.

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/profile', auth, userController.updateProfile);

module.exports = router;