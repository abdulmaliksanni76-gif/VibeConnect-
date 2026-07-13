const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  fileUrl: String,   // New field
  fileType: String,  // e.g., 'image', 'pdf'
  status: { type: String, default: 'sent' }
}, { timestamps: true });


module.exports = mongoose.model('Message', messageSchema);