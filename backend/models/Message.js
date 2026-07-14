const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  fileUrl: String,   // New field
  fileType: String,  // e.g., 'image', 'pdf'
  fileName: String,
  status: { type: String, default: 'sent' },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
}, { timestamps: true });


module.exports = mongoose.model('Message', messageSchema);