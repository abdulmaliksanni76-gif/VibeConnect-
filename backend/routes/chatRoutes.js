const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');
// Import both functions from chatController
// const { getUserConversations, uploadChatImage } = require('../controllers/chatController');
const {
    getUserConversations,
    uploadFile
} = require("../controllers/chatController");

// --- ROUTES ---

// Get all conversations
router.get('/conversations', auth, getUserConversations);

// Create or get existing chat
router.post('/create', auth, async (req, res) => {
    const { participantId } = req.body;
    const currentUserId = req.user.id;
    let chat = await Conversation.findOne({
        participants: { $all: [currentUserId, participantId] }
    });
    if (!chat) {
        chat = await Conversation.create({ participants: [currentUserId, participantId] });
    }
    res.json(chat);
});

// Get messages for a specific chat
router.get('/messages/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.chatId })
      .populate('sender', 'username')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'username' } // Populates sender of the original message
      })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Send message
router.post('/send', auth, async (req, res) => {
    const { conversationId, text, fileUrl, fileType } = req.body;

    const newMessage = new Message({
        conversationId,
        sender: req.user.id,
        text: req.body.text,
        fileUrl: req.body.fileUrl,
        fileType: req.body.fileType,
        // Add this line to capture the field!
        fileName: req.body.fileName 
    });
await newMessage.save();

    const previewText = fileType === 'audio' ? "Voice note" : 
                        fileType === 'image' ? "Image" : 
                        text.length > 30 ? text.substring(0, 30) + "..." : text;

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: previewText,
        updatedAt: new Date()
    });

    const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username');
    const io = req.app.get('io');
    io.to(conversationId).emit("receive_message", populatedMessage);
    io.emit("refresh_sidebar"); 
    res.status(200).json(populatedMessage);
});

// Image Upload Route - FIXED
// router.post('/upload-image', auth, uploadChatImage);

// Get chat info
// router.get('/info/:conversationId', auth, async (req, res) => {
//   try {
//     const chat = await Conversation.findById(req.params.conversationId).populate('participants', 'username');
//     res.json(chat);
//   } catch (err) {
//     res.status(500).json({ message: "Error" });
//   }
// });

router.get('/info/:conversationId', auth, async (req, res) => {
  try {
    const chat = await Conversation.findById(req.params.conversationId)
      .populate('participants', 'username photoUrl');

    if (!chat) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    res.json(chat);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching chat info"
    });
  }
});

router.delete('/message/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.messageId);
    
    const lastMsg = await Message.findOne({ conversationId: message.conversationId })
      .sort({ createdAt: -1 });

    await Conversation.findByIdAndUpdate(message.conversationId, {
      lastMessage: lastMsg ? lastMsg.text : "No messages yet",
      updatedAt: lastMsg ? lastMsg.createdAt : new Date()
    });

    const io = req.app.get('io');
    io.to(message.conversationId).emit("message_deleted", req.params.messageId);
    io.to(message.conversationId).emit("refresh_sidebar"); 
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

router.put('/message/:messageId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.messageId, 
      { text }, 
      { new: true }
    ).populate('sender', 'username');

    const lastMsg = await Message.findOne({ conversationId: updatedMessage.conversationId })
      .sort({ createdAt: -1 });

    const updatedChat = await Conversation.findByIdAndUpdate(
      updatedMessage.conversationId,
      { lastMessage: lastMsg ? lastMsg.text : "No messages yet" },
      { new: true }
    );

    const io = req.app.get('io');
    io.to(updatedMessage.conversationId).emit("message_updated", updatedMessage);
    io.to(updatedMessage.conversationId).emit("refresh_sidebar"); 
    
    res.json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;