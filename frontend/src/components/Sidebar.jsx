import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Mic } from 'lucide-react'; 
import './Sidebar.css';
import Vibeconnect from '../assets/Vibe Connect-3.png';
import { formatTimestamp } from '../components/dateUtils';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import BottomNav from './BottomNav';
import { useUser } from '../context/UserContext';

const BASE_URL = import.meta.env.VITE_API_URL || "";

const Sidebar = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const socket = useContext(SocketContext);

  // const fetchConversations = async () => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/chat/conversations`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  //     setConversations(sorted);
  //   } catch (err) { 
  //     console.error("Fetch Conversations Error:", err.response?.data || err.message); 
  //   }
  // };

  // const fetchConversations = async () => {
  //   const token = localStorage.getItem('token');
    
  //   // If no token exists yet, just return silently
  //   if (!token) return;

  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/chat/conversations`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  //     setConversations(sorted);
  //   } catch (err) { 
  //     console.error("Fetch Conversations Error:", err.response?.data || err.message); 
  //   }
  // };

  // In Sidebar.jsx, add this guard clause
const fetchConversations = async () => {
  const token = localStorage.getItem('token');
  if (!token) return; // Do nothing if token isn't ready yet

  try {
    const res = await axios.get(`${BASE_URL}/api/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setConversations(res.data);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
};

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      const email = e.target.value.trim();
      console.log("Searching for:", email); // Log the email being sent

      try {
        const userRes = await axios.get(`${BASE_URL}/api/users/search?email=${encodeURIComponent(email)}`);
        console.log("User found:", userRes.data);
        
        const chatRes = await axios.post(`${BASE_URL}/api/chat/create`, 
          { participantId: userRes.data._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        fetchConversations();
        navigate(`/chat/${chatRes.data._id}`);
      } catch (err) {
        // This log will tell us if it's a 404 (Not Found) or a 500 (Server Error)
        console.error("Search failed:", err.response?.data || err.message);
        alert("Search failed: " + (err.response?.data?.message || "User not found"));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchConversations();
    
    if (!socket) return;

    const refresh = () => fetchConversations();

    socket.on("receive_message", refresh);
    socket.on("message_updated", refresh);
    socket.on("message_deleted", refresh);
    socket.on("refresh_sidebar", refresh);
    window.addEventListener('chat_updated', refresh);

    return () => {
      socket.off("receive_message", refresh);
      socket.off("message_updated", refresh);
      socket.off("message_deleted", refresh);
      socket.off("refresh_sidebar", refresh);
      window.removeEventListener('chat_updated', refresh);
    };
  }, [socket]);
  

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <div className="header-logo-group">
          <img src={Vibeconnect} alt="Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Vibe <br /> Connect</h2>
        </div>
        
        <button onClick={handleLogout} className="logout-icon-btn" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search or start a new chat" 
          onKeyDown={handleSearch} 
          className="search-input"
        />
      </div>

        <div className="chat-list">
          {conversations.map((chat) => {
            const currentUserId = localStorage.getItem("userId"); 
            const otherParticipant = chat.participants.find((p) => String(p._id) !== String(currentUserId));
            const isActive = chat._id === conversationId;

            return (
              <div 
                key={chat._id} 
                className={`chat-item ${isActive ? 'active-chat' : ''}`} 
                onClick={() => navigate(`/chat/${chat._id}`)}
              >
                {/* Added Avatar for the person you're chatting with */}
                {/* <img 
                  src={otherParticipant?.profilePic || Vibeconnect} 
                  alt={otherParticipant?.username || "Avatar"} 
                  className="chat-item-avatar"
                /> */}
                <img 
                  src={otherParticipant?.photoUrl || Vibeconnect} 
                  alt={otherParticipant?.username || "Avatar"} 
                  className="chat-item-avatar"
                />

                <div className="chat-info">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="m-0">{otherParticipant ? otherParticipant.username : "Chat"}</h4>
                    <span className="text-muted small">{formatTimestamp(chat.updatedAt)}</span>
                  </div>

                  <p className="last-message m-0">
                    {chat.lastMessage === "Voice note" ? (
                      <span className="text-primary"><Mic size={15} /> Voice note</span>
                    ) : chat.lastMessage === "Image" ? (
                      <span className="text-secondary">📷 Image</span>
                    ) : (
                      chat.lastMessage || "No messages yet"
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <BottomNav />
      </div>
    );
  };
export default Sidebar;