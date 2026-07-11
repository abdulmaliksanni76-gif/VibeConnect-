// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2, Plus, Image, FileText, X, Download, Mic, Play } from 'lucide-react';
// import axios from 'axios';
// import './Chat.css';
// import AudioPlayer from '../components/AudioPlayer';

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatData, setChatData] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [showFileMenu, setShowFileMenu] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [fullScreenMedia, setFullScreenMedia] = useState(null);
  
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const userId = localStorage.getItem("userId");
//   const recipient = chatData?.participants?.find(p => p._id !== userId);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (editingMessageId !== null) inputRef.current?.focus();
//   }, [editingMessageId]);

//   const downloadFile = async (url, fileName) => {
//     try {
//       const response = await fetch(`${BASE_URL}${url}`);
//       const blob = await response.blob();
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = fileName || 'download';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) { console.error("Download failed", err); }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const config = { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } };
//         const [msgsRes, infoRes] = await Promise.all([
//           axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, config),
//           axios.get(`${BASE_URL}/api/chat/info/${conversationId}`, config)
//         ]);
//         setMessages(msgsRes.data || []);
//         setChatData(infoRes.data || null);
//       } catch (err) { console.error("Fetch Error:", err); }
//     };
//     if (conversationId) fetchData();
//   }, [conversationId]);

//   useEffect(() => {
//     if (!socket || !userId) return;
//     socket.emit("user_connected", userId);
//     socket.emit("join_chat", conversationId);
    
//     const handleReceive = (msg) => {
//       setMessages(prev => [...prev, msg]);
//       if (msg.sender?._id !== userId && msg.status === 'sent') {
//         socket.emit("mark_delivered", { messageId: msg._id, senderId: msg.sender?._id });
//       }
//     };
//     const handleUpdated = (updatedMsg) => setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
//     const handleDeleted = (msgId) => setMessages(prev => prev.filter(m => m._id !== msgId));
//     const handleDelivered = (msgId) => setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'delivered' } : m));

//     socket.on("receive_message", handleReceive);
//     socket.on("message_updated", handleUpdated);
//     socket.on("message_deleted", handleDeleted);
//     socket.on("message_delivered", handleDelivered);
//     socket.on("get_online_users", setOnlineUsers);
    
//     return () => {
//       socket.off("receive_message", handleReceive);
//       socket.off("message_updated", handleUpdated);
//       socket.off("message_deleted", handleDeleted);
//       socket.off("message_delivered", handleDelivered);
//       socket.off("get_online_users");
//     };
//   }, [conversationId, socket, userId]);

//   const sendMessage = async (text = null, fileData = null) => {
//     if (editingMessageId) {
//       const res = await axios.put(`${BASE_URL}/api/chat/message/${editingMessageId}`, 
//         { text: text || input }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
//       if (res.status === 200) {
//         socket.emit("message_updated", res.data);
//         setEditingMessageId(null);
//         setInput("");
//       }
//       return;
//     }
//     if (!input.trim() && !fileData) return;
//     socket.emit("send_message", { conversationId, text: text || input, senderId: userId, fileUrl: fileData?.fileUrl, fileType: fileData?.fileType });
//     setInput("");
//   };

//   const deleteMessage = async (messageId) => {
//     await axios.delete(`${BASE_URL}/api/chat/message/${messageId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
//     setMessages(prev => prev.filter(m => m._id !== messageId));
//     socket.emit("message_deleted", { messageId, conversationId });
//     setMenu({ visible: false, x: 0, y: 0, messageId: null });
//   };

//   const handleFileUpload = async (file, type) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     const res = await axios.post(`${BASE_URL}/api/chat/upload`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
//     await sendMessage(file.name, { fileUrl: res.data.filePath, fileType: type });
//     setShowFileMenu(false);
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;
//     audioChunksRef.current = [];
//     mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
//     mediaRecorder.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//       handleFileUpload(new File([audioBlob], "voice.webm", { type: 'audio/webm' }), 'audio');
//     };
//     mediaRecorder.start();
//     setIsRecording(true);
//   };

//   const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

//   return (
//     <div className="chat-app-container" onClick={() => { setMenu({ visible: false }); setShowFileMenu(false); }}>
//       <div className="chat-header">
//         <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft /></button>
//         <div className='user-info'>
//           <h3>{recipient?.username || "Chat"}</h3>
//           <small>{onlineUsers.includes(recipient?._id) ? "Online" : "Offline"}</small>
//         </div>
//       </div>

//       <div className="messages-window">
//         {messages.map((m) => (
//           <div key={m._id} className={`message-wrapper ${m.sender?._id === userId ? 'sent-wrapper' : 'received-wrapper'}`} 
//                onContextMenu={(e) => m.sender?._id === userId && (e.preventDefault(), setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId: m._id }))}>
    
//             <div className={`message-bubble ${m.sender?._id === userId ? 'sent' : 'received'} ${m.fileType ? 'media-bubble' : ''}`}>
//               {m.fileType === 'image' ? (
//                 <img src={`${BASE_URL}${m.fileUrl}`} className="msg-media-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'image'})} />
//               ) : m.fileType === 'video' ? (
//                 <div className="video-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'video'})}>
//                   <video src={`${BASE_URL}${m.fileUrl}`} preload="metadata" />
//                   <div className="play-overlay"><Play fill="white" size={40} /></div>
//                 </div>
//               ) : m.fileType === 'doc' ? (
//                 <div className="doc-preview" onClick={() => downloadFile(m.fileUrl, m.text)}>
//                   <FileText size={24} /> <span>{m.text}</span>
//                 </div>
//               ) : m.fileType === 'audio' ? <AudioPlayer url={`${BASE_URL}${m.fileUrl}`} /> : <p>{m.text}</p>}
              
//               <div className="msg-time">
//                 {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 {m.sender?._id === userId && (
//                    <span className="status-icons">
//                      {m.status === 'delivered' ? <CheckCheck size={14} color="#001b93" /> : <Check size={14} />}
//                    </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

      // {fullScreenMedia && (
      //   <div className="fullscreen-overlay">
      //     <button className="close-fullscreen" onClick={() => setFullScreenMedia(null)}><X size={30} /></button>
      //     <button className="download-fullscreen" onClick={() => downloadFile(fullScreenMedia.url, 'media')}><Download size={30} /></button>
      //     {fullScreenMedia.type === 'image' ? (
      //       <img src={`${BASE_URL}${fullScreenMedia.url}`} className="fullscreen-content" />
      //     ) : (
      //       <video src={`${BASE_URL}${fullScreenMedia.url}`} controls autoPlay className="fullscreen-content" />
      //     )}
      //   </div>
      // )}

      // {menu.visible && (
      //   <div className="context-menu" style={{ position: 'fixed', top: menu.y, left: menu.x }}>
      //     <button onClick={() => { const m = messages.find(msg => msg._id === menu.messageId); setInput(m.text); setEditingMessageId(m._id); setMenu({visible: false}) }}><Edit size={18}/>Edit</button>
      //     <button onClick={() => deleteMessage(menu.messageId)}><Trash2 size={18}/>Delete</button>
      //   </div>
      // )}

//       {/* <div className="input-area">
//         <button className="plus-btn" onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); }}><Plus /></button>
//         <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <X /> : <Mic />}</button>

//         {showFileMenu && (
//           <div className="file-menu" onClick={(e) => e.stopPropagation()}>
//             <label><Image size={20}/> Photos & Videos <input type="file" accept="image/*,video/*" hidden onChange={(e) => handleFileUpload(e.target.files[0], e.target.files[0].type.startsWith('video') ? 'video' : 'image')} /></label>
//             <label><FileText size={20}/> Document <input type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => handleFileUpload(e.target.files[0], 'doc')} /></label>
//           </div>
//         )}

//         <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }} />
        
//         <button onClick={() => sendMessage()} className="send-btn"><Send /></button>
//       </div> */}
//       {/* ... your messages-window ... */}

// <div className="input-area">
//   <button className="plus-btn" onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); }}><Plus /></button>
//   <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <X /> : <Mic />}</button>

//   {showFileMenu && (
//     <div className="file-menu" onClick={(e) => e.stopPropagation()}>
//       <label><Image size={20}/> Photos & Videos <input type="file" accept="image/*,video/*" hidden onChange={(e) => handleFileUpload(e.target.files[0], e.target.files[0].type.startsWith('video') ? 'video' : 'image')} /></label>
//       <label><FileText size={20}/> Document <input type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => handleFileUpload(e.target.files[0], 'doc')} /></label>
//     </div>
//   )}

//   <div 
//     className="message-input-div"
//     contentEditable="true"
//     role="textbox"
//     aria-multiline="true"
//     ref={inputRef}
//     onInput={(e) => setInput(e.currentTarget.innerText)}
//     onKeyDown={(e) => { 
//       if (e.key === 'Enter' && !e.shiftKey) { 
//         e.preventDefault(); 
//         sendMessage(); 
//         inputRef.current.innerText = ''; // Clear text after sending
//         setInput(''); // Reset state
//       } 
//     }}
//   />
  
//   <button onClick={() => {
//     sendMessage();
//     inputRef.current.innerText = '';
//     setInput('');
//   }} className="send-btn"><Send /></button>
// </div>
//     </div>
//   );
// };

// export default Chat;

// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2, Plus, Image, FileText, X, Download, Mic, Play } from 'lucide-react';
// import axios from 'axios';
// import './Chat.css';
// import AudioPlayer from '../components/AudioPlayer';

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const getRelativeDate = (dateString) => {
//   const date = new Date(dateString);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   if (date.toDateString() === today.toDateString()) return "Today";
//   if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
//   return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
// };

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatData, setChatData] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [showFileMenu, setShowFileMenu] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [fullScreenMedia, setFullScreenMedia] = useState(null);
  
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const userId = localStorage.getItem("userId");
//   const recipient = chatData?.participants?.find(p => p._id !== userId);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

// // Sync Input when editing and auto-focus
// useEffect(() => {
//   if (editingMessageId) {
//     const msg = messages.find(m => m._id === editingMessageId);
//     if (msg && inputRef.current) {
//       inputRef.current.innerText = msg.text;
//       setInput(msg.text);
      
//       // Auto-focus logic
//       inputRef.current.focus();
      
//       // Move cursor to the end of the text
//       const range = document.createRange();
//       const selection = window.getSelection();
//       range.selectNodeContents(inputRef.current);
//       range.collapse(false); // false = end of selection
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   } else {
//     if (inputRef.current) {
//       inputRef.current.innerText = '';
//     }
//     setInput('');
//   }
// }, [editingMessageId, messages]);

//   const downloadFile = async (url, fileName) => {
//     try {
//       const response = await fetch(`${BASE_URL}${url}`);
//       const blob = await response.blob();
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = fileName || 'download';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) { console.error("Download failed", err); }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const config = { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } };
//         const [msgsRes, infoRes] = await Promise.all([
//           axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, config),
//           axios.get(`${BASE_URL}/api/chat/info/${conversationId}`, config)
//         ]);
//         setMessages(msgsRes.data || []);
//         setChatData(infoRes.data || null);
//       } catch (err) { console.error("Fetch Error:", err); }
//     };
//     if (conversationId) fetchData();
//   }, [conversationId]);

//   useEffect(() => {
//     if (!socket || !userId) return;
//     socket.emit("user_connected", userId);
//     socket.emit("join_chat", conversationId);
    
//     const handleReceive = (msg) => {
//       setMessages(prev => [...prev, msg]);
//       if (msg.sender?._id !== userId && msg.status === 'sent') {
//         socket.emit("mark_delivered", { messageId: msg._id, senderId: msg.sender?._id });
//       }
//     };
//     const handleUpdated = (updatedMsg) => setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
//     const handleDeleted = (msgId) => setMessages(prev => prev.filter(m => m._id !== msgId));
//     const handleDelivered = (msgId) => setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'delivered' } : m));

//     socket.on("receive_message", handleReceive);
//     socket.on("message_updated", handleUpdated);
//     socket.on("message_deleted", handleDeleted);
//     socket.on("message_delivered", handleDelivered);
//     socket.on("get_online_users", setOnlineUsers);
    
//     return () => {
//       socket.off("receive_message", handleReceive);
//       socket.off("message_updated", handleUpdated);
//       socket.off("message_deleted", handleDeleted);
//       socket.off("message_delivered", handleDelivered);
//       socket.off("get_online_users");
//     };
//   }, [conversationId, socket, userId]);

//   const sendMessage = async (text = null, fileData = null) => {
//     if (editingMessageId) {
//       const res = await axios.put(`${BASE_URL}/api/chat/message/${editingMessageId}`, 
//         { text: text || input }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
//       if (res.status === 200) {
//         socket.emit("message_updated", res.data);
//         setEditingMessageId(null);
//         setInput("");
//       }
//       return;
//     }
//     if (!input.trim() && !fileData) return;
//     socket.emit("send_message", { conversationId, text: text || input, senderId: userId, fileUrl: fileData?.fileUrl, fileType: fileData?.fileType });
//     setInput("");
//   };

//   const deleteMessage = async (messageId) => {
//     await axios.delete(`${BASE_URL}/api/chat/message/${messageId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
//     setMessages(prev => prev.filter(m => m._id !== messageId));
//     socket.emit("message_deleted", { messageId, conversationId });
//     setMenu({ visible: false, x: 0, y: 0, messageId: null });
//   };

//   const handleFileUpload = async (file, type) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     const res = await axios.post(`${BASE_URL}/api/chat/upload`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
//     await sendMessage(file.name, { fileUrl: res.data.filePath, fileType: type });
//     setShowFileMenu(false);
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;
//     audioChunksRef.current = [];
//     mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
//     mediaRecorder.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//       handleFileUpload(new File([audioBlob], "voice.webm", { type: 'audio/webm' }), 'audio');
//     };
//     mediaRecorder.start();
//     setIsRecording(true);
//   };

//   const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

//   return (
//     <div className="chat-app-container" onClick={() => { setMenu({ visible: false }); setShowFileMenu(false); }}>
//       <div className="chat-header">
//         <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft /></button>
//         <div className='user-info'>
//           <h3>{recipient?.username || "Chat"}</h3>
//           <small>{onlineUsers.includes(recipient?._id) ? "Online" : "Offline"}</small>
//         </div>
//       </div>

//       <div className="messages-window">
//         {messages.map((m, index) => {
//           const currentDate = new Date(m.createdAt).toDateString();
//           const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
//           const showDate = index === 0 || currentDate !== prevDate;

//           return (
//             <div key={m._id}>
//               {showDate && <div className="date-divider"><span>{getRelativeDate(m.createdAt)}</span></div>}
              
//               <div className={`message-wrapper ${m.sender?._id === userId ? 'sent-wrapper' : 'received-wrapper'}`} 
//                    onContextMenu={(e) => m.sender?._id === userId && (e.preventDefault(), setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId: m._id }))}>
//                 {/* <div className={`message-bubble ${m.sender?._id === userId ? 'sent' : 'received'} ${m.fileType ? 'media-bubble' : ''}`}> */}
//                 <div className={`message-bubble ${m.sender?._id === userId ? 'sent' : 'received'} ${m.fileType ? 'media-bubble' : ''}`}>
//                   {m.fileType === 'image' ? (
//                     <img src={`${BASE_URL}${m.fileUrl}`} className="msg-media-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'image'})} />
//                   ) : m.fileType === 'video' ? (
//                     <div className="video-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'video'})}>
//                       <video src={`${BASE_URL}${m.fileUrl}`} preload="metadata" />
//                       <div className="play-overlay"><Play fill="white" size={40} /></div>
//                     </div>
//                   ) : m.fileType === 'doc' ? (
//                     <div className="doc-preview" onClick={() => downloadFile(m.fileUrl, m.text)}>
//                       <FileText size={24} /> <span>{m.text}</span>
//                     </div>
//                   ) : m.fileType === 'audio' ? <AudioPlayer url={`${BASE_URL}${m.fileUrl}`} /> : <p>{m.text}</p>}
                  
//                   <div className="msg-time" style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'flex-end', 
//                     gap: '4px',
//                     fontSize: '0.7rem',
//                     marginTop: '4px' 
//                   }}>
//                     {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     {m.sender?._id === userId && (
//                        <span className="status-icons">
//                          {m.status === 'delivered' ? <CheckCheck size={14} color="#001b93" /> : <Check size={14} />}
//                        </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//             {fullScreenMedia && (
//         <div className="fullscreen-overlay">
//           <button className="close-fullscreen" onClick={() => setFullScreenMedia(null)}><X size={30} /></button>
//           <button className="download-fullscreen" onClick={() => downloadFile(fullScreenMedia.url, 'media')}><Download size={30} /></button>
//           {fullScreenMedia.type === 'image' ? (
//             <img src={`${BASE_URL}${fullScreenMedia.url}`} className="fullscreen-content" />
//           ) : (
//             <video src={`${BASE_URL}${fullScreenMedia.url}`} controls autoPlay className="fullscreen-content" />
//           )}
//         </div>
//       )}

//       {menu.visible && (
//         <div className="context-menu" style={{ position: 'fixed', top: menu.y, left: menu.x }}>
//           <button onClick={() => { 
//             const m = messages.find(msg => msg._id === menu.messageId); 
//             setInput(m.text); 
//             if (inputRef.current) {
//               inputRef.current.innerText = m.text; // This displays the text in the div
//             }
//             setEditingMessageId(m._id); 
//             setMenu({visible: false}); 
//           }}>
//             <Edit size={18}/>Edit
//           </button>
//           <button onClick={() => deleteMessage(menu.messageId)}><Trash2 size={18}/>Delete</button>
//         </div>
//       )}
//       <div className="input-area">
//         <button className="plus-btn" onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); }}><Plus /></button>
//         <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <X /> : <Mic />}</button>

//         {showFileMenu && (
//           <div className="file-menu" onClick={(e) => e.stopPropagation()}>
//             <label><Image size={20}/> Photos & Videos <input type="file" accept="image/*,video/*" hidden onChange={(e) => handleFileUpload(e.target.files[0], e.target.files[0].type.startsWith('video') ? 'video' : 'image')} /></label>
//             <label><FileText size={20}/> Document <input type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => handleFileUpload(e.target.files[0], 'doc')} /></label>
//           </div>
//         )}

//         <div 
//           className="message-input-div"
//           contentEditable="true"
//           role="textbox"
//           aria-multiline="true"
//           ref={inputRef}
//           onInput={(e) => setInput(e.currentTarget.innerText)}
//           onKeyDown={(e) => { 
//             if (e.key === 'Enter' && !e.shiftKey) { 
//               e.preventDefault(); 
//               sendMessage(); 
//               inputRef.current.innerText = '';
//               setInput('');
//             } 
//           }}
//         />
        
//         <button onClick={() => { sendMessage(); inputRef.current.innerText = ''; setInput(''); }} className="send-btn"><Send /></button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2, Plus, Image, FileText, X, Download, Mic, Play, Copy } from 'lucide-react';
import axios from 'axios';
import './Chat.css';
import AudioPlayer from '../components/AudioPlayer';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const Chat = () => {
  const socket = useContext(SocketContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [fullScreenMedia, setFullScreenMedia] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const userId = localStorage.getItem("userId");
  const recipient = chatData?.participants?.find(p => p._id !== userId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (editingMessageId) {
      const msg = messages.find(m => m._id === editingMessageId);
      if (msg && inputRef.current) {
        inputRef.current.innerText = msg.text;
        setInput(msg.text);
        inputRef.current.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      if (inputRef.current) inputRef.current.innerText = '';
      setInput('');
    }
  }, [editingMessageId, messages]);

  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(`${BASE_URL}${url}`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { console.error("Download failed", err); }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } };
        const [msgsRes, infoRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/chat/messages/${conversationId}`, config),
          axios.get(`${BASE_URL}/api/chat/info/${conversationId}`, config)
        ]);
        setMessages(msgsRes.data || []);
        setChatData(infoRes.data || null);
      } catch (err) { console.error("Fetch Error:", err); }
    };
    if (conversationId) fetchData();
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("user_connected", userId);
    socket.emit("join_chat", conversationId);
    
    const handleReceive = (msg) => {
      setMessages(prev => [...prev, msg]);
      if (msg.sender?._id !== userId && msg.status === 'sent') {
        socket.emit("mark_delivered", { messageId: msg._id, senderId: msg.sender?._id });
      }
    };
    const handleUpdated = (updatedMsg) => setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    const handleDeleted = (msgId) => setMessages(prev => prev.filter(m => m._id !== msgId));
    const handleDelivered = (msgId) => setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'delivered' } : m));

    socket.on("receive_message", handleReceive);
    socket.on("message_updated", handleUpdated);
    socket.on("message_deleted", handleDeleted);
    socket.on("message_delivered", handleDelivered);
    socket.on("get_online_users", setOnlineUsers);
    
    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_updated", handleUpdated);
      socket.off("message_deleted", handleDeleted);
      socket.off("message_delivered", handleDelivered);
      socket.off("get_online_users");
    };
  }, [conversationId, socket, userId]);

  const sendMessage = async (text = null, fileData = null) => {
    if (editingMessageId) {
      const res = await axios.put(`${BASE_URL}/api/chat/message/${editingMessageId}`, 
        { text: text || input }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.status === 200) {
        socket.emit("message_updated", res.data);
        setEditingMessageId(null);
        setInput("");
        if (inputRef.current) inputRef.current.innerText = '';
      }
      return;
    }
    if (!input.trim() && !fileData) return;
    socket.emit("send_message", { conversationId, text: text || input, senderId: userId, fileUrl: fileData?.fileUrl, fileType: fileData?.fileType });
    setInput("");
    if (inputRef.current) inputRef.current.innerText = '';
  };

  const deleteMessage = async (messageId) => {
    await axios.delete(`${BASE_URL}/api/chat/message/${messageId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    setMessages(prev => prev.filter(m => m._id !== messageId));
    socket.emit("message_deleted", { messageId, conversationId });
    setMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${BASE_URL}/api/chat/upload`, formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    await sendMessage(file.name, { fileUrl: res.data.filePath, fileType: type });
    setShowFileMenu(false);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];
    mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      handleFileUpload(new File([audioBlob], "voice.webm", { type: 'audio/webm' }), 'audio');
    };
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  return (
    <div className="chat-app-container" onClick={() => { setMenu({ visible: false }); setShowFileMenu(false); }}>
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft /></button>
        <div className='user-info'>
          <h3>{recipient?.username || "Chat"}</h3>
          <small>{onlineUsers.includes(recipient?._id) ? "Online" : "Offline"}</small>
        </div>
      </div>

      <div className="messages-window">
        {messages.map((m, index) => {
          const currentDate = new Date(m.createdAt).toDateString();
          const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const showDate = index === 0 || currentDate !== prevDate;
          return (
            <div key={m._id}>
              {showDate && <div className="date-divider"><span>{getRelativeDate(m.createdAt)}</span></div>}
              <div className={`message-wrapper ${m.sender?._id === userId ? 'sent-wrapper' : 'received-wrapper'}`} 
                   onContextMenu={(e) => { e.preventDefault(); setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId: m._id }); }}>
                <div className={`message-bubble ${m.sender?._id === userId ? 'sent' : 'received'} ${m.fileType ? 'media-bubble' : ''}`}>
                  {m.fileType === 'image' ? <img src={`${BASE_URL}${m.fileUrl}`} className="msg-media-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'image'})} />
                   : m.fileType === 'video' ? <div className="video-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'video'})}><video src={`${BASE_URL}${m.fileUrl}`} preload="metadata" /><div className="play-overlay"><Play fill="white" size={40} /></div></div>
                   : m.fileType === 'doc' ? <div className="doc-preview" onClick={() => downloadFile(m.fileUrl, m.text)}><FileText size={24} /> <span>{m.text}</span></div>
                   : m.fileType === 'audio' ? <AudioPlayer url={`${BASE_URL}${m.fileUrl}`} /> : <p>{m.text}</p>}
                  <div className="msg-time" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.7rem', marginTop: '4px' }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {m.sender?._id === userId && <span className="status-icons">{m.status === 'delivered' ? <CheckCheck size={14} color="#001b93" /> : <Check size={14} />}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {fullScreenMedia && (
        <div className="fullscreen-overlay">
          <button className="close-fullscreen" onClick={() => setFullScreenMedia(null)}><X size={30} /></button>
          <button className="download-fullscreen" onClick={() => downloadFile(fullScreenMedia.url, 'media')}><Download size={30} /></button>
          {fullScreenMedia.type === 'image' ? <img src={`${BASE_URL}${fullScreenMedia.url}`} className="fullscreen-content" /> : <video src={`${BASE_URL}${fullScreenMedia.url}`} controls autoPlay className="fullscreen-content" />}
        </div>
      )}

      {menu.visible && (
        <div className="context-menu" style={{ position: 'fixed', top: menu.y, left: menu.x }}>
          {(() => {
            const m = messages.find(msg => msg._id === menu.messageId);
            const isSender = m?.sender?._id === userId;
            return (
              <>
                <button onClick={() => { navigator.clipboard.writeText(m.text); setMenu({ visible: false }); }}><Copy size={18}/>Copy</button>
                {isSender && (
                  <>
                    <button onClick={() => { setEditingMessageId(m._id); setMenu({visible: false}); }}><Edit size={18}/>Edit</button>
                    <button onClick={() => deleteMessage(m._id)}><Trash2 size={18}/>Delete</button>
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}

      <div className="input-area">
        <button className="plus-btn" onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); }}><Plus /></button>
        <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <X /> : <Mic />}</button>
        {showFileMenu && (
          <div className="file-menu" onClick={(e) => e.stopPropagation()}>
            <label><Image size={20}/> Photos & Videos <input type="file" accept="image/*,video/*" hidden onChange={(e) => handleFileUpload(e.target.files[0], e.target.files[0].type.startsWith('video') ? 'video' : 'image')} /></label>
            <label><FileText size={20}/> Document <input type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => handleFileUpload(e.target.files[0], 'doc')} /></label>
          </div>
        )}
        <div className="message-input-div" contentEditable="true" role="textbox" aria-multiline="true" ref={inputRef} onInput={(e) => setInput(e.currentTarget.innerText)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
        <button onClick={() => sendMessage()} className="send-btn"><Send /></button>
      </div>
    </div>
  );
};

export default Chat;