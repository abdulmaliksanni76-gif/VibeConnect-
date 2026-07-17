import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2, Plus, Image, FileText, X, Download, Mic, Play, Pause, Copy, Reply, ArrowDown } from 'lucide-react';
import axios from 'axios';
import './Chat.css';
import AudioPlayer from '../components/AudioPlayer';
import { useMemo } from 'react';
import MessageList from "../components/MessageList";
import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import { useLayoutEffect } from "react";


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
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null, ready: false, });
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
  const [recordingTime, setRecordingTime] = useState(0);
  const discardRecording = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecipientRecording,setIsRecipientRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const menuRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const recipient = chatData?.participants?.find(p => p._id !== userId);
  console.log("Recipient:", recipient);

  useEffect(() => {
  if (messages.length > prevMessagesLength.current && !showScrollBtn) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  
  prevMessagesLength.current = messages.length;
}, [messages]);

useEffect(() => {
  if (isDeleting.current) return;

  if (!showScrollBtn) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]); 

 const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    console.log(scrollTop, scrollHeight, clientHeight);

    const isAtBottom =
        scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollBtn(!isAtBottom);
};
const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

const handleTouchEnd = (e, message) => {
  const touchEnd = e.changedTouches[0].clientX;
  if (touchEnd - touchStart > 50) { 
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

    socket.on("recording", (data) => {
        console.log("Recording event received:", data);

        if (data.senderId === recipient?._id) {
            setIsRecipientRecording(true);
        }
    });

    socket.on("stop_recording", (data) => {
        console.log("Stop recording event:", data);

        if (data.senderId === recipient?._id) {
            setIsRecipientRecording(false);
        }
    });

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_updated", handleUpdated);
      socket.off("message_deleted", handleDeleted);
      socket.off("message_delivered", handleDelivered);
      socket.off("get_online_users");
      socket.off("recording");
      socket.off("stop_recording");
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

    socket.emit("send_message", {
        conversationId,
        text: text || input,
        senderId: userId,

        fileUrl: fileData?.fileUrl,
        fileType: fileData?.fileType,
        fileName: fileData?.fileName,

        replyTo: replyingTo?._id || null
    });

    setReplyingTo(null);
    setInput("");
    if (inputRef.current) inputRef.current.innerText = '';
  };

const deleteMessage = async (messageId) => {
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
  
  await sendMessage(caption, { 
    fileUrl: res.data.filePath, 
    fileType: pendingMedia.type,
    fileName: pendingMedia.file.name 
});
  
  setPendingMedia(null);
  setCaption("");
};

const scrollToMessage = (msgId) => {

    const element = document.getElementById(msgId);

    if (!element) return;

    element.scrollIntoView({
        behavior:"smooth",
        block:"center"
    });

    element.classList.add("message-highlight");

    setTimeout(() => {
        element.classList.remove("message-highlight");
    },1000);

};



const previewUrl = useMemo(() => {
  return pendingMedia ? URL.createObjectURL(pendingMedia.file) : null;
}, [pendingMedia]);

useEffect(() => {
  return () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };
}, [previewUrl]);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (!discardRecording.current) {
            handleFileUpload(
                new File([audioBlob], "voice.webm", {
                    type: "audio/webm",
                }),
                "audio"
            );
        }

        discardRecording.current = false;

        setRecordingTime(0);
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (err) {
      console.log(err);
    }

    console.log("Sending recording event");

    socket.emit("recording",{
        conversationId,
        senderId:userId
    });
  };

  const stopRecording = () => {

      mediaRecorderRef.current?.stop();

      mediaRecorderRef.current?.stream
          ?.getTracks()
          .forEach(track => track.stop());

      console.log("Stopping recording event");

      socket.emit("stop_recording",{
          conversationId,
          senderId:userId
      });

      setIsRecording(false);

  };

  const cancelRecording = () => {

      discardRecording.current = true;

      // Tell the other user that recording has stopped
      socket.emit("stop_recording", {
          conversationId,
          senderId: userId,
      });

      mediaRecorderRef.current?.stop();

      mediaRecorderRef.current?.stream
          ?.getTracks()
          .forEach(track => track.stop());

      setIsRecording(false);

      setRecordingTime(0);

  };

  const sendRecording = () => {

      discardRecording.current = false;

      mediaRecorderRef.current?.stop();

      mediaRecorderRef.current?.stream
          ?.getTracks()
          .forEach(track => track.stop());

      setIsRecording(false);

  };

  const pauseRecording = () => {

      mediaRecorderRef.current?.pause();

      setIsPaused(true);

  };

  const resumeRecording = () => {

      mediaRecorderRef.current?.resume();

      setIsPaused(false);

  };

  const handleInputChange = (e) => {
  setInput(e.target.value);

  socket.emit("typing", {
    conversationId: conversationId, 
    senderId: userId
  });
};

  useEffect(() => {
    if (conversationId) { 
      socket.emit("join_chat", conversationId);
    }
  }, [conversationId, socket]); 

useEffect(() => {

    if (!isRecording || isPaused) return;

    const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);

}, [isRecording, isPaused]);





const activeReply = useMemo(() => {
  if (!replyingTo) return null;
  return messages.find(m => m._id === replyingTo._id) || replyingTo;
}, [replyingTo, messages]);

useEffect(() => {
  socket.on("typing", (data) => {
    if (data.senderId !== userId) {
      setIsRecipientTyping(true); 
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
  e.stopPropagation();

  setMenu({
    visible: true,
    x: e.clientX,
    y: e.clientY,
    messageId,
    ready: false,
  });
};

useLayoutEffect(() => {
  if (!menu.visible || !menuRef.current || menu.ready) return;

  const { offsetWidth, offsetHeight } = menuRef.current;

  let x = menu.x;
  let y = menu.y;

  if (x + offsetWidth > window.innerWidth) {
    x = window.innerWidth - offsetWidth - 10;
  }

  if (y + offsetHeight > window.innerHeight) {
    y = window.innerHeight - offsetHeight - 10;
  }

  x = Math.max(10, x);
  y = Math.max(10, y);

  setMenu((prev) => ({
    ...prev,
    x,
    y,
    ready: true,
  }));
}, [menu]);

const formatTime = (seconds)=>{

    const mins=Math.floor(seconds/60);

    const secs=seconds%60;

    return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

}

  return (
    <div
    className="chat-app-container"
    onClick={() => {
        if (menu.visible) {
            setMenu({
                visible: false,
                x: 0,
                y: 0,
                messageId: null,
                isPositioned: false,
            });
        }

        setShowFileMenu(false);
    }}
>
      <ChatHeader
          recipient={recipient}
          onlineUsers={onlineUsers}
          isRecipientTyping={isRecipientTyping}
          isRecipientRecording={isRecipientRecording}
          navigate={navigate}
      />

<div className="chat-body" onScroll={handleScroll} style={{ position: 'relative', overflowY: 'auto', flex: 1 }}>
      <div className="messages-window">
        {messages.map((m, index) => {
        const previousMessage = messages[index - 1];
        const nextMessage = messages[index + 1];

        const isSameSenderAsPrevious =
          previousMessage &&
          previousMessage.sender?._id === m.sender?._id &&
          new Date(previousMessage.createdAt).toDateString() ===
            new Date(m.createdAt).toDateString();

        const isSameSenderAsNext =
          nextMessage &&
          nextMessage.sender?._id === m.sender?._id &&
          new Date(nextMessage.createdAt).toDateString() ===
            new Date(m.createdAt).toDateString();
        const currentDate = new Date(m.createdAt).toDateString();

        const prevDate =
            index > 0
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null;

        const showDate =
            index === 0 || currentDate !== prevDate;

    return (
        <MessageBubble
            key={m._id}
            message={m}
            isMine={m.sender?._id === userId}
            userId={userId}
            showDate={showDate}
            dateLabel={getRelativeDate(m.createdAt)}
            isSameSenderAsPrevious={isSameSenderAsPrevious}
            isSameSenderAsNext={isSameSenderAsNext}
            downloadFile={downloadFile}
            setFullScreenMedia={setFullScreenMedia}
            scrollToMessage={scrollToMessage}
            handleContextMenu={handleContextMenu}
            setReplyingTo={setReplyingTo}
            inputRef={inputRef}
            setMenu={setMenu}
            menuRef={menuRef}
        />
        );
    })}
        <div ref={messagesEndRef} style={{ height: "1px", width: "100%" }} />
      </div>
        
      </div>


      {fullScreenMedia && (
        <div
          className="fullscreen-overlay"
          onClick={() => setFullScreenMedia(null)}
        >
          <button
            className="close-fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenMedia(null);
            }}
          >
            <X size={26} />
          </button>

          <button
            className="download-fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(fullScreenMedia.url, "media");
            }}
          >
            <Download size={24} />
          </button>

          {fullScreenMedia.type === "image" ? (
            <img
              src={`${BASE_URL}${fullScreenMedia.url}`}
              className="fullscreen-content"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={`${BASE_URL}${fullScreenMedia.url}`}
              controls
              autoPlay
              className="fullscreen-content"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      {menu.visible && (
        
        <div
          ref={menuRef}
          className="context-menu"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: menu.y,
            left: menu.x,
            zIndex: 99999,
            visibility: menu.ready ? "visible" : "hidden",
          }}
        >
          {(() => {
            const m = messages.find(msg => msg._id === menu.messageId);
            const isSender = m?.sender?._id === userId;
            return (
              <>
                <button onClick={() => { navigator.clipboard.writeText(m.text); setMenu({ visible: false }); }}><Copy size={18}/>Copy</button>
                <button onClick={() => {
                  // Pass the ID or the message object, but ensure it's up-to-date
                  const m = messages.find(msg => msg._id === menu.messageId);
                  setReplyingTo(m); 
                  setMenu({ visible: false });
                  inputRef.current?.focus();
                }}>
                  <Reply size={18} /> Reply
                </button>
                <div className="menu-divider" />
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

            <div className="reply-left">
                <span className="reply-title">
                    Replying to {activeReply.sender?.username || "User"}
                </span>

                <p>
                    {activeReply.text
                        ? activeReply.text
                        : activeReply.fileType === "image"
                        ? "📷 Photo"
                        : activeReply.fileType === "video"
                        ? "🎥 Video"
                        : activeReply.fileType === "audio"
                        ? "🎤 Voice Note"
                        : "📄 Document"}
                </p>
            </div>

            <button
                className="reply-close-btn"
                onClick={() => setReplyingTo(null)}
            >
                <X size={18} />
            </button>

        </div>
    )}

    {!isRecording ? (

    <div className="composer">

        <button
            className="plus-btn"
            onClick={(e)=>{
                e.stopPropagation();
                setShowFileMenu(!showFileMenu);
            }}
        >
            <Plus size={22}/>
        </button>

        <div
            className="message-input-div"
            contentEditable
            ref={inputRef}
            data-placeholder="Type a message..."
            role="textbox"
            suppressContentEditableWarning

            onInput={(e)=>{

                const element=e.currentTarget;

                const text=element.innerText.replace(/\n$/,"").trim();

                if(!text){

                    element.innerHTML="";

                    setInput("");

                    socket.emit("stop_typing",{
                        conversationId,
                        senderId:userId
                    });

                    clearTimeout(window.typingTimer);

                    return;

                }

                setInput(text);

                socket.emit("typing",{
                    conversationId,
                    senderId:userId
                });

                clearTimeout(window.typingTimer);

                window.typingTimer=setTimeout(()=>{

                    socket.emit("stop_typing",{
                        conversationId,
                        senderId:userId
                    });

                },2000);

            }}

            onKeyDown={(e)=>{

                const mobile=window.matchMedia("(pointer: coarse)").matches;

                if(!mobile){

                    if(e.key==="Enter" && !e.shiftKey){

                        e.preventDefault();

                        sendMessage();

                    }

                }

            }}

        />

        {input.trim() ? (

            // <button
            //     className="send-btn"
            //     onClick={sendMessage}
            // >
            //     <Send size={20}/>
            // </button>

            <button
                className="send-btn"
                onClick={() => {
                    console.log("Send button clicked");
                    sendMessage();
                }}
            >
                <Send size={20}/>
            </button>

        ) : (

            <button
                className="mic-btn"
                onClick={() => {
                    console.log("Mic clicked");
                    startRecording();
                }}
            >
                <Mic size={20} />
            </button>

        )}

    </div>

    ) : (

    <div className="recording-bar">

        <button
            className="delete-recording-btn"
            onClick={cancelRecording}
        >
            <Trash2 size={20}/>
        </button>

        <span className="record-time">

            {formatTime(recordingTime)}

        </span>

        <div className="record-wave">

            {Array.from({length:28}).map((_,i)=>

                <span
                    key={i}
                    style={{
                        animationDelay:`${i*0.06}s`
                    }}
                />

            )}

        </div>

        <button
            className="pause-recording-btn"
            onClick={
                isPaused
                    ? resumeRecording
                    : pauseRecording
            }
        >

            {isPaused ? (

                <Play size={18}/>

            ) : (

                <Pause size={18}/>

            )}

        </button>

        <button
            className="send-recording-btn"
            onClick={stopRecording}
        >
            <Send size={20}/>
        </button>

    </div>

    )}

    {showFileMenu && (

        <div
            className="file-menu"
            onClick={(e)=>e.stopPropagation()}
        >

            <label>

                <Image size={20}/>

                <span>Photos & Videos</span>

                <input
                    hidden
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e)=>
                        handleFileSelected(
                            e.target.files[0],
                            e.target.files[0].type.startsWith("video")
                                ? "video"
                                : "image"
                        )
                    }
                />

            </label>

            <label>

                <FileText size={20}/>

                <span>Documents</span>

                <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e)=>
                        handleFileSelected(
                            e.target.files[0],
                            "doc"
                        )
                    }
                />

            </label>

        </div>

    )}

</div>
     
              {/* {pendingMedia && (
                <div className="media-preview-modal">
                  <button className="close-btn" onClick={() => setShowDiscardConfirm(true)}><X size={24} /></button>
                  
                  <div className="modal-content">
                    {pendingMedia.type === 'image' ? (
                      <img src={previewUrl} alt="preview" />
                    ) : pendingMedia.type === 'video' ? (
                      <video src={previewUrl} controls />
                    ) : (
                      <div className="doc-preview-modal">
                        <FileText size={64} />
                        <p>{pendingMedia.file.name}</p>
                      </div>
                    )}
                    
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
      )} */}

      {pendingMedia && (

      <div
          className="media-preview-overlay"
      >

          <button
              className="media-close-btn"
              onClick={() => setShowDiscardConfirm(true)}
          >
              <X size={26}/>
          </button>

          <div className="media-preview-container">

              <div className="media-preview-content">

                  {pendingMedia.type === "image" && (

                      <img
                          src={previewUrl}
                          alt=""
                          className="preview-image"
                      />

                  )}

                  {pendingMedia.type === "video" && (

                      <video
                          src={previewUrl}
                          controls
                          className="preview-video"
                      />

                  )}

                  {pendingMedia.type === "doc" && (

                      <div className="preview-document">

                          <FileText size={80}/>

                          <h3>

                              {pendingMedia.file.name}

                          </h3>

                          <p>

                              {(pendingMedia.file.size/1024/1024).toFixed(2)} MB

                          </p>

                      </div>

                  )}

              </div>

              <div className="media-bottom">

                  <input
                      className="caption-input"
                      placeholder="Add a caption..."
                      value={caption}
                      onChange={(e)=>setCaption(e.target.value)}
                      onKeyDown={(e)=>{

                          if(e.key==="Enter"){

                              finalizeMediaUpload();

                          }

                      }}
                  />

                  <button
                      className="send-media-btn"
                      onClick={finalizeMediaUpload}
                  >

                      <Send size={22}/>

                  </button>

              </div>

          </div>

          {showDiscardConfirm && (

              <div className="discard-overlay">

                  <div className="discard-modal">

                      <h3>

                          Discard media?

                      </h3>

                      <p>

                          Your selected media and caption will be lost.

                      </p>

                      <div className="discard-actions">

                          <button
                              className="cancel-discard"
                              onClick={()=>setShowDiscardConfirm(false)}
                          >

                              Cancel

                          </button>

                          <button
                              className="confirm-discard"
                              onClick={()=>{

                                  setPendingMedia(null);

                                  setCaption("");

                                  setShowDiscardConfirm(false);

                              }}
                          >

                              Discard

                          </button>

                      </div>

                  </div>

              </div>

          )}

      </div>

      )}
    </div>
  );
};

export default Chat;