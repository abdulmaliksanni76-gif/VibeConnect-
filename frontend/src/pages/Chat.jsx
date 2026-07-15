import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2, Plus, Image, FileText, X, Download, Mic, Play, Copy, Reply, ArrowDown } from 'lucide-react';
import axios from 'axios';
import './Chat.css';
import AudioPlayer from '../components/AudioPlayer';
import { useMemo } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || "";

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
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null, isPositioned: false });
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [fullScreenMedia, setFullScreenMedia] = useState(null);
  const [pendingMedia, setPendingMedia] = useState(null); // {file, type}
  const [caption, setCaption] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const isUserAtBottom = useRef(true);
  const prevMessagesLength = useRef(messages.length);
  const isDeleting = useRef(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const menuRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const recipient = chatData?.participants?.find(p => p._id !== userId);

  useEffect(() => {
  if (messages.length > prevMessagesLength.current && !showScrollBtn) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Update the ref for next time
  prevMessagesLength.current = messages.length;
}, [messages]);

useEffect(() => {
  // 1. If we are in the middle of a deletion, stop everything
  if (isDeleting.current) return;

  if (!showScrollBtn) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]); // This single hook handles all scroll-to-bottom logic

 const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  
  // Calculate distance from bottom: 
  // If we are more than 100px from the bottom, show the button
  const isAtBottom = (scrollHeight - scrollTop - clientHeight) < 100;
  
  setShowScrollBtn(!isAtBottom);
};
const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

const handleTouchEnd = (e, message) => {
  const touchEnd = e.changedTouches[0].clientX;
  if (touchEnd - touchStart > 50) { // Threshold for swipe right
    setReplyingTo(message);
    inputRef.current?.focus();
  }
};

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
    // const handleUpdated = (updatedMsg) => setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    const handleUpdated = (updatedMsg) => {
      setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
      setReplyingTo(prev => (prev && prev._id === updatedMsg._id ? updatedMsg : prev));
    };
    const handleDeleted = (msgId) => setMessages(prev => prev.filter(m => m._id !== msgId));
    const handleDelivered = (msgId) => setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'delivered' } : m));

    socket.on("receive_message", handleReceive);
    socket.on("message_updated", handleUpdated);
    socket.on("message_deleted", handleDeleted);
    socket.on("message_delivered", handleDelivered);
    socket.on("get_online_users", setOnlineUsers);
    socket.on("typing", (data) => {
      if (data.senderId === recipient?._id) setIsRecipientTyping(true);
    });

    socket.on("stop_typing", (data) => {
      if (data.senderId === recipient?._id) setIsRecipientTyping(false);
    });

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_updated", handleUpdated);
      socket.off("message_deleted", handleDeleted);
      socket.off("message_delivered", handleDelivered);
      socket.off("get_online_users");
    };
  }, [conversationId, socket, userId]);

  // const sendMessage = async (text = null, fileData = null) => {
  //   if (editingMessageId) {
  //     const res = await axios.put(`${BASE_URL}/api/chat/message/${editingMessageId}`, 
  //       { text: text || input }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
  //     if (res.status === 200) {
  //       socket.emit("message_updated", res.data);
  //       setEditingMessageId(null);
  //       setInput("");
  //       if (inputRef.current) inputRef.current.innerText = '';
  //     }
  //     return;
  //   }
  //   if (!input.trim() && !fileData) return;
  //   socket.emit("send_message", { conversationId, text: text || input, senderId: userId, fileUrl: fileData?.fileUrl, fileType: fileData?.fileType });
  //   setInput("");
  //   if (inputRef.current) inputRef.current.innerText = '';
  // };

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

    // New payload includes replyTo ID if it exists
    socket.emit("send_message", { 
      conversationId, 
      text: text || input, 
      senderId: userId, 
      fileUrl: fileData?.fileUrl, 
      fileType: fileData?.fileType,
      replyTo: replyingTo?._id || null 
    });

    // Clear states after sending
    setReplyingTo(null);
    setInput("");
    if (inputRef.current) inputRef.current.innerText = '';
  };

  // const deleteMessage = async (messageId) => {
  //   await axios.delete(`${BASE_URL}/api/chat/message/${messageId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
  //   setMessages(prev => prev.filter(m => m._id !== messageId));
  //   socket.emit("message_deleted", { messageId, conversationId });
  //   setMenu({ visible: false, x: 0, y: 0, messageId: null });
  // };

//   const deleteMessage = async (messageId) => {
//   // Set the flag to TRUE
//   isDeleting.current = true;
  
//   await axios.delete(`${BASE_URL}/api/chat/message/${messageId}`, { 
//     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
//   });
  
//   setMessages(prev => prev.filter(m => m._id !== messageId));
//   socket.emit("message_deleted", { messageId, conversationId });
//   setMenu({ visible: false, x: 0, y: 0, messageId: null });

//   // Reset the flag after a brief delay to allow the state to update
//   setTimeout(() => {
//     isDeleting.current = false;
//   }, 500);
// };

const deleteMessage = async (messageId) => {
  // Set the flag to TRUE
  isDeleting.current = true;
  
  try {
    await axios.delete(`${BASE_URL}/api/chat/message/${messageId}`, { 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    
    setMessages(prev => prev.filter(m => m._id !== messageId));
    socket.emit("message_deleted", { messageId, conversationId });
    setMenu({ visible: false, x: 0, y: 0, messageId: null });
  } catch (error) {
    console.error("Delete failed", error);
  } finally {
    // Reset the flag after a delay regardless of success/failure
    setTimeout(() => {
      isDeleting.current = false;
    }, 1000);
  }
};


  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${BASE_URL}/api/chat/upload`, formData, { 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    
    // FIX: If it's an audio file/voice note, send an empty string instead of file.name
    const messageText = type === 'audio' ? "" : file.name;
    
    await sendMessage(messageText, { fileUrl: res.data.filePath, fileType: type });
    setShowFileMenu(false);
  };

  const handleFileSelected = (file, type) => {
  setPendingMedia({ file, type });
  setShowFileMenu(false);
};

const finalizeMediaUpload = async () => {
  const formData = new FormData();
  formData.append('file', pendingMedia.file);
  
  const res = await axios.post(`${BASE_URL}/api/chat/upload`, formData, { 
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
  });

  console.log("Sending File Name:", pendingMedia.file.name);
  
  // Send the message: 'caption' is the text, 'fileName' is a new property
  await sendMessage(caption, { 
    fileUrl: res.data.filePath, 
    fileType: pendingMedia.type,
    fileName: pendingMedia.file.name // This key MUST match what the backend expects
});
  
  setPendingMedia(null);
  setCaption("");
};

const scrollToMessage = (msgId) => {
  const element = document.getElementById(msgId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};



const previewUrl = useMemo(() => {
  return pendingMedia ? URL.createObjectURL(pendingMedia.file) : null;
}, [pendingMedia]);

// Cleanup memoized URL when component unmounts or media is cleared
useEffect(() => {
  return () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };
}, [previewUrl]);

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

  const handleInputChange = (e) => {
  setInput(e.target.value); // Use your actual input state name (you defined it as 'input')

  socket.emit("typing", {
    conversationId: conversationId, // Use the correct variable name here
    senderId: userId
  });
};

  useEffect(() => {
    if (conversationId) { // Changed from currentChatId to conversationId
      socket.emit("join_chat", conversationId);
    }
  }, [conversationId, socket]); // Include socket in dependency array

//   const activeReply = useMemo(() => {
//   if (!replyingTo) return null;
//   // This will automatically update whenever the messages array changes (e.g., after an edit)
//   return messages.find(m => m._id === replyingTo._id) || replyingTo;
// }, [replyingTo, messages]);

const activeReply = useMemo(() => {
  if (!replyingTo) return null;
  // This fetches the latest version of the message from your current state
  return messages.find(m => m._id === replyingTo._id) || replyingTo;
}, [replyingTo, messages]);

useEffect(() => {
  socket.on("typing", (data) => {
    if (data.senderId !== userId) {
      setIsRecipientTyping(true); // Assuming this is your state for the typing indicator
    }
  });

  socket.on("stop_typing", (data) => {
    setIsRecipientTyping(false);
  });

  return () => {
    socket.off("typing");
    socket.off("stop_typing");
  };
}, [socket, userId]);

const handleContextMenu = (e, messageId) => {
  e.preventDefault();

  // Show it off-screen first so we can measure it
  // setMenu({ visible: true, x: -9999, y: -9999, messageId, ready: false });
  setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId });

  requestAnimationFrame(() => {
    if (menuRef.current) {
      const { offsetWidth, offsetHeight } = menuRef.current;
      let x = e.clientX;
      let y = e.clientY;

      // Logic to flip
      if (x + offsetWidth > window.innerWidth) x = e.clientX - offsetWidth;
      if (y + offsetHeight > window.innerHeight) y = e.clientY - offsetHeight;

      // Update position and set ready: true
      setMenu({ visible: true, x, y, messageId, ready: true });
    }
  });
};

useEffect(() => {
  if (menu.visible && menuRef.current) {
    const { offsetWidth, offsetHeight } = menuRef.current;
    let x = menu.x;
    let y = menu.y;

    if (x + offsetWidth > window.innerWidth) x = menu.x - offsetWidth;
    if (y + offsetHeight > window.innerHeight) y = menu.y - offsetHeight;

    // Update position AND set isPositioned to true
    setMenu(prev => ({ ...prev, x, y, isPositioned: true }));
  } else {
    // Reset when hidden
    setMenu(prev => ({ ...prev, isPositioned: false }));
  }
}, [menu.visible, menu.x, menu.y]);

  return (
    <div className="chat-app-container" onClick={() => { setMenu({ visible: false }); setShowFileMenu(false); }}>
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft /></button>
        <div className='user-info'>
          <h3>{recipient?.username || "Chat"}</h3>
          {/* <small>{onlineUsers.includes(recipient?._id) ? "Online" : "Offline"}</small> */}
          {isRecipientTyping ? (
            <small className="typing-indicator">typing...</small>
          ) : (
            <small>{onlineUsers.includes(recipient?._id) ? "Online" : "Offline"}</small>
          )}
        </div>
      </div>

<div className="chat-body" onScroll={handleScroll} style={{ position: 'relative', overflowY: 'auto', flex: 1 }}>
      <div className="messages-window">
        {messages.map((m, index) => {
          const currentDate = new Date(m.createdAt).toDateString();
          const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const showDate = index === 0 || currentDate !== prevDate;
          console.log("Rendering message:", m);
            if (m.fileType === 'doc' && !m.fileName) {
              console.warn("CRITICAL: This document is missing a fileName property!", m);
            }
            console.log("Rendering message ID:", m._id, "with fileName:", m.fileName);
          return (
            // <div key={m._id} id={m._id}>
            // {/* <div key={m._id}> */}
            //   {showDate && <div className="date-divider"><span>{getRelativeDate(m.createdAt)}</span></div>}
            //   <div className={`message-wrapper ${m.sender?._id === userId ? 'sent-wrapper' : 'received-wrapper'}`} 
            //        onContextMenu={(e) => { e.preventDefault(); setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId: m._id }); }}>
            <div 
  key={m._id} 
  id={m._id}
  // NEW: Add these touch handlers
  onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
  onTouchEnd={(e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchEnd - touchStart;
    
    // If swiped right by more than 60px, trigger reply
    if (diff > 60) {
      setReplyingTo(m); 
      inputRef.current?.focus();
    }
  }}
>
  {showDate && <div className="date-divider"><span>{getRelativeDate(m.createdAt)}</span></div>}
  <div 
    className={`message-wrapper ${m.sender?._id === userId ? 'sent-wrapper' : 'received-wrapper'}`} 
    onContextMenu={(e) => { 
      e.preventDefault(); 
      setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId: m._id }); 
    }}
  >
                <div className={`message-bubble ${m.sender?._id === userId ? 'sent' : 'received'} ${m.fileType ? 'media-bubble' : ''}`}>
  
                  {m.fileType === 'doc' ? (
                    <div className="doc-preview" onClick={() => downloadFile(m.fileUrl, m.fileName)}>
                      <FileText size={32} />
                      <div className="doc-info">
                        <span className="doc-name">
                          {m.fileName 
                            ? (m.fileName.includes('-') ? m.fileName.split('-').slice(1).join('-') : m.fileName)
                            : (m.fileUrl ? m.fileUrl.split('/').pop().replace(/^\d+-/, "") : "Document")
                          }
                        </span>
                      </div>
                    </div>
                  ) : m.fileType === 'image' ? (
                    <img src={`${BASE_URL}${m.fileUrl}`} className="msg-media-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'image'})} />
                  ) : m.fileType === 'video' ? (
                    <div className="video-preview" onClick={() => setFullScreenMedia({url: m.fileUrl, type: 'video'})}>
                      <video src={`${BASE_URL}${m.fileUrl}`} preload="metadata" />
                      <div className="play-overlay"><Play fill="white" size={40} /></div>
                    </div>
                  ) : m.fileType === 'audio' ? (
                    <AudioPlayer url={`${BASE_URL}${m.fileUrl}`} />
                  ) : null}

                  {m.replyTo && (
                    // <div className="quoted-message">
                    <div className="quoted-message" onClick={() => scrollToMessage(m.replyTo._id)}>
                      <div className="quoted-sender">
                        {/* If it's an object, get the name; otherwise, default to 'Replying...' */}
                        {typeof m.replyTo === 'object' ? m.replyTo.sender?.username : "Replying to..."}
                      </div>
                      <p className="quoted-text">
                        {typeof m.replyTo === 'object' 
                          ? (m.replyTo.text || (m.replyTo.fileType === 'audio' ? "🎤 Voice Note" : "📎 File"))
                          : "Message"}
                      </p>
                    </div>
                  )}

                  {/* 3. CAPTION: Only renders if m.text has content */}
                  {m.text && (
                    <p className={m.fileType ? "media-caption" : "message-text"}>
                      {m.text}
                    </p>
                  )}

                  {/* 4. TIME & STATUS */}
                  <div className="msg-time">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {m.sender?._id === userId && (
                      <span className="status-icons">{m.status === 'delivered' ? <CheckCheck size={14} /> : <Check size={14} />}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} style={{ height: "1px", width: "100%" }} />
      </div>
        
      </div>

      {fullScreenMedia && (
        <div className="fullscreen-overlay">
          <button className="close-fullscreen" onClick={() => setFullScreenMedia(null)}><X size={30} /></button>
          <button className="download-fullscreen" onClick={() => downloadFile(fullScreenMedia.url, 'media')}><Download size={30} /></button>
          {fullScreenMedia.type === 'image' ? <img src={`${BASE_URL}${fullScreenMedia.url}`} className="fullscreen-content" /> : <video src={`${BASE_URL}${fullScreenMedia.url}`} controls autoPlay className="fullscreen-content" />}
        </div>
      )}

      {menu.visible && (
        <div 
          ref={menuRef}
          className="context-menu"
          style={{ 
            position: 'fixed',
            top: `${menu.y}px`,
            left: `${menu.x}px`,
            zIndex: 1000,
            // Only show when the calculation is done
            visibility: menu.isPositioned ? 'visible' : 'hidden' 
          }}
        >
          {(() => {
            const m = messages.find(msg => msg._id === menu.messageId);
            const isSender = m?.sender?._id === userId;
            return (
              <>
                <button onClick={() => { navigator.clipboard.writeText(m.text); setMenu({ visible: false }); }}><Copy size={18}/>Copy</button>
                {/* <button onClick={() => {
                  const m = messages.find(msg => msg._id === menu.messageId);
                  setReplyingTo(m); 
                  setMenu({ visible: false });
                  inputRef.current?.focus();
                }}>
                  <Reply size={18} /> Reply
                </button> */}
                <button onClick={() => {
                  // Pass the ID or the message object, but ensure it's up-to-date
                  const m = messages.find(msg => msg._id === menu.messageId);
                  setReplyingTo(m); 
                  setMenu({ visible: false });
                  inputRef.current?.focus();
                }}>
                  <Reply size={18} /> Reply
                </button>
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

      {console.log("Is button visible?", showScrollBtn)}
      {showScrollBtn && (
      <button 
        className={`scroll-to-bottom-btn ${showScrollBtn ? 'visible' : ''}`} 
        onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ArrowDown size={18} />
      </button>
      )}
      

      <div className="input-area">
        {activeReply && (
          <div className="reply-preview">
            <div className="reply-bar">
              <span>Replying to {activeReply.sender?.username || "User"}</span>
              <button className="reply-close-btn" onClick={() => setReplyingTo(null)}>
                <X size={16} />
              </button>
            </div>
            <p className="reply-text-preview">
              {activeReply.text 
                ? activeReply.text 
                : activeReply.fileType === 'audio' 
                  ? "🎤 Voice Note" 
                  : "📷 Media File"}
            </p>
          </div>
        )}

      <div className="input-row">
        <button className="plus-btn" onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); }}><Plus /></button>
        <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <X /> : <Mic />}</button>
        {showFileMenu && (
          <div className="file-menu" onClick={(e) => e.stopPropagation()}>
            <label><Image size={20}/> Photos & Videos <input type="file" accept="image/*,video/*" hidden onChange={(e) => handleFileSelected(e.target.files[0], e.target.files[0].type.startsWith('video') ? 'video' : 'image')} /></label>
            <label><FileText size={20}/> Document <input type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => handleFileSelected(e.target.files[0], 'doc')} /></label>
          </div>
        )}

        {/* <div className="message-input-div" contentEditable="true" role="textbox" aria-multiline="true" ref={inputRef} onInput={(e) => setInput(e.currentTarget.innerText)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} /> */}
        <div 
          className="message-input-div" 
          contentEditable="true" 
          role="textbox" 
          aria-multiline="true" 
          ref={inputRef} 
          onInput={(e) => {
            setInput(e.currentTarget.innerText);
            
            // Emit typing event
            socket.emit("typing", { conversationId, senderId: userId });

            // Reset timer to stop typing indicator after 2 seconds of inactivity
            clearTimeout(window.typingTimer);
            window.typingTimer = setTimeout(() => {
              socket.emit("stop_typing", { conversationId, senderId: userId });
            }, 2000);
          }} 
          onKeyDown={(e) => { 
            if (e.key === 'Enter' && !e.shiftKey) { 
              e.preventDefault(); 
              sendMessage(); 
              // Stop typing immediately when sent
              socket.emit("stop_typing", { conversationId, senderId: userId });
            } 
          }} 
        />
        <button onClick={() => sendMessage()} className="send-btn"><Send /></button>
      </div>
    </div>
     
              {pendingMedia && (
                <div className="media-preview-modal">
                  <button className="close-btn" onClick={() => setShowDiscardConfirm(true)}><X size={24} /></button>
                  
                  <div className="modal-content">
                    {pendingMedia.type === 'image' ? (
                      <img src={previewUrl} alt="preview" />
                    ) : pendingMedia.type === 'video' ? (
                      <video src={previewUrl} controls />
                    ) : (
                      /* Document Preview UI */
                      <div className="doc-preview-modal">
                        <FileText size={64} />
                        <p>{pendingMedia.file.name}</p>
                      </div>
                    )}
                    
                    {/* <input placeholder="Add a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} /> */}
                    <input 
                      placeholder="Add a caption..." 
                      value={caption} 
                      onChange={(e) => setCaption(e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          finalizeMediaUpload();
                        }
                      }}
                    />
                    <button className="send-media-btn" onClick={finalizeMediaUpload}>Send</button>
                  </div>

          {showDiscardConfirm && (
            <div className="confirm-modal">
              <h3>Discard selection?</h3>
              <div className="confirm-actions">
                <button className="cancel-btn" onClick={() => setShowDiscardConfirm(false)}>Cancel</button>
                <button className="discard-btn" onClick={() => { setPendingMedia(null); setCaption(""); setShowDiscardConfirm(false); }}>Discard</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;