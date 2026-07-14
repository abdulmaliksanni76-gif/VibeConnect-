require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

const app = express();
const server = http.createServer(app);
const onlineUsers = new Map();


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Important for cookies/sessions
  }
});

app.set('io', io);
app.use(cors());
app.use(express.json());
connectDB();

io.on("connection", (socket) => {
  socket.on("user_connected", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("get_online_users", Array.from(onlineUsers.keys()));
  });

  // socket.on("join_chat", (conversationId) => {
  //   socket.join(conversationId);
  // });

  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

//   socket.on("send_message", async (data) => {
//   try {
//     const newMessage = new Message({ 
//         conversationId: data.conversationId,
//         sender: data.senderId, 
//         text: data.text || "", 
//         fileUrl: data.fileUrl,
//         fileType: data.fileType || 'text', 
//         status: 'sent' 
//     });
//     await newMessage.save();
    
//     let previewText = data.text;
//     if (data.fileType === 'audio') previewText = "Voice note";
//     else if (data.fileType === 'image') previewText = "Image";
//     else if (data.fileUrl) previewText = "File"; 
    
//     await Conversation.findByIdAndUpdate(data.conversationId, {
//         lastMessage: previewText,
//         updatedAt: new Date()
//     });
    
//     const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username'); 
//     io.to(data.conversationId).emit("receive_message", populatedMessage);
//     io.emit("refresh_sidebar");
//   } catch (err) { console.error("Send Error:", err); }
// });

socket.on("send_message", async (data) => {
  try {
    const newMessage = new Message({ 
        conversationId: data.conversationId,
        sender: data.senderId, 
        text: data.text || "", 
        fileUrl: data.fileUrl,
        fileType: data.fileType || 'text', 
        status: 'sent',
        replyTo: data.replyTo || null // Add this line
    });
    await newMessage.save();
    
    let previewText = data.text;
    if (data.fileType === 'audio') previewText = "Voice note";
    else if (data.fileType === 'image') previewText = "Image";
    else if (data.fileUrl) previewText = "File"; 
    
    await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: previewText,
        updatedAt: new Date()
    });
    
    // Update the populate to include the replied-to message if needed
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username')
      .populate('replyTo', 'text fileType'); // Populates basic info of the replied message
      
    io.to(data.conversationId).emit("receive_message", populatedMessage);
    io.emit("refresh_sidebar");
  } catch (err) { console.error("Send Error:", err); }
});

  // Typing logic
  socket.on("typing", (data) => {
    // Emit to everyone in the room except the sender
    socket.to(data.conversationId).emit("typing", { senderId: data.senderId });
  });

  socket.on("stop_typing", (data) => {
    // Emit to everyone in the room except the sender
    socket.to(data.conversationId).emit("stop_typing", { senderId: data.senderId });
  });

  socket.on("mark_delivered", async ({ messageId, senderId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("message_delivered", messageId);
      }
    } catch (err) { console.error("Delivery Error:", err); }
  });

  socket.on("message_updated", (updatedMsg) => {
    io.to(updatedMsg.conversationId).emit("message_updated", updatedMsg);
    io.emit("refresh_sidebar"); 
  });

  socket.on("message_deleted", (data) => {
    io.to(data.conversationId).emit("message_deleted", data.messageId);
    io.emit("refresh_sidebar");
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("get_online_users", Array.from(onlineUsers.keys()));
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat', uploadRoutes);
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./config/db');
// const Message = require('./models/Message');
// const Conversation = require('./models/Conversation'); 
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const onlineUsers = new Map();

// // FIX 1: Allow production URL in CORS
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? "https://vibeconnect-1-f4m7.onrender.com" 
//     : "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// };

// const io = new Server(server, { cors: corsOptions });

// app.set('io', io);
// app.use(cors(corsOptions)); // Apply options here
// app.use(express.json());
// connectDB();

// io.on("connection", (socket) => {
//   // ... (keep your existing socket logic exactly as is)
//   socket.on("user_connected", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     io.emit("get_online_users", Array.from(onlineUsers.keys()));
//   });

//   socket.on("join_chat", (conversationId) => {
//     socket.join(conversationId);
//   });

//   socket.on("send_message", async (data) => {
//     try {
//       const newMessage = new Message({ 
//         conversationId: data.conversationId,
//         sender: data.senderId, 
//         text: data.text || "", 
//         fileUrl: data.fileUrl,
//         fileType: data.fileType || 'text', 
//         status: 'sent' 
//       });
//       await newMessage.save();
      
//       let previewText = data.text;
//       if (data.fileType === 'audio') previewText = "Voice note";
//       else if (data.fileType === 'image') previewText = "Image";
//       else if (data.fileUrl) previewText = "File"; 
      
//       await Conversation.findByIdAndUpdate(data.conversationId, {
//         lastMessage: previewText,
//         updatedAt: new Date()
//       });
      
//       const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username'); 
//       io.to(data.conversationId).emit("receive_message", populatedMessage);
//       io.emit("refresh_sidebar");
//     } catch (err) { console.error("Send Error:", err); }
//   });

//   socket.on("mark_delivered", async ({ messageId, senderId }) => {
//     try {
//       await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
//       const senderSocketId = onlineUsers.get(senderId);
//       if (senderSocketId) {
//         io.to(senderSocketId).emit("message_delivered", messageId);
//       }
//     } catch (err) { console.error("Delivery Error:", err); }
//   });

//   socket.on("message_updated", (updatedMsg) => {
//     io.to(updatedMsg.conversationId).emit("message_updated", updatedMsg);
//     io.emit("refresh_sidebar"); 
//   });

//   socket.on("message_deleted", (data) => {
//     io.to(data.conversationId).emit("message_deleted", data.messageId);
//     io.emit("refresh_sidebar");
//   });

//   socket.on("disconnect", () => {
//     for (let [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         break;
//       }
//     }
//     io.emit("get_online_users", Array.from(onlineUsers.keys()));
//   });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/chat', uploadRoutes);
// app.use('/uploads', express.static('uploads'));

// // FIX 2: Correct route syntax for Express v5
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));
//   app.get('*', (req, res) => 
//     res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'))
//   );
// }else {
//   app.get('/', (req, res) => {
//     res.send('API is running....');
//   });
// }

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));