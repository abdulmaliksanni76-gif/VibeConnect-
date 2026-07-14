const Conversation = require('../models/Conversation');
const { upload } = require('../config/cloudinary');


exports.getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ 
            participants: req.user.id 
        })
        // Crucial: Populate participants from the 'User' collection
        .populate('participants', 'username photoUrl') 
        .sort({ updatedAt: -1 });
        
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// New function to handle chat image uploads
exports.uploadChatImage = [
    upload.single('image'),
    async (req, res) => {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        res.status(200).json({ imageUrl: req.file.path });
    }
];