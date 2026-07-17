import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Sidebar.css';
import { formatTimestamp } from '../components/dateUtils';
import { SocketContext } from '../context/SocketContext';
import BottomNav from '../components/BottomNav';
import UserAvatar from "../components/UserAvatar";
import NewChatPanel from "../components/NewChatPanel";
import {
  Search,
  Mic,
  Plus,
  MoreVertical
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const Sidebar = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const socket = useContext(SocketContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarView, setSidebarView] = useState("chats");

  const fetchConversations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
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

  const filteredChats = conversations.filter(chat => {

    const currentUserId = localStorage.getItem("userId");

    const otherParticipant = chat.participants.find(
        p => String(p._id) !== String(currentUserId)
    );

    return (
        otherParticipant?.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

});

  return (
    <div className="sidebar-content">
        
      <div className="sidebar-header">

        <h2 className="sidebar-title">
            VibeConnect
        </h2>

        <div className="sidebar-header-actions">

            <button
                className="header-icon-btn"
                onClick={() => setShowMenu(!showMenu)}
            >
                <MoreVertical size={22}/>
            </button>

        </div>

    </div>
      
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input
            type="text"
            placeholder="Search chats..."
            className="search-input"
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
        />
      </div>

      {showMenu && (

        <div className="sidebar-popup-menu">

            <button>
                New Group
            </button>

            <button>
                Starred Messages
            </button>

            <button
                onClick={() => navigate("/chat/settings")}
            >
                Settings
            </button>

            <button
                className="danger-item"
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

        )}

      <div className="chat-list">
        {filteredChats.length === 0 && (

        <div className="no-chat-found">

            <Search size={34}/>

            <h4>No chats found</h4>

            <p>
                Try searching for another username.
            </p>

        </div>

        )}
        {filteredChats.map((chat) => {
          const currentUserId = localStorage.getItem("userId"); 
          const otherParticipant = chat.participants.find((p) => String(p._id) !== String(currentUserId));
          const isActive = chat._id === conversationId;
          return (
            <div key={chat._id} className={`chat-item ${isActive ? 'active-chat' : ''}`} onClick={() => navigate(`/chat/${chat._id}`)}>
              {/* <img src={otherParticipant?.photoUrl} alt={otherParticipant?.username || "Avatar"} className="chat-item-avatar" /> */}
              <UserAvatar
                  user={otherParticipant}
                  size={48}
                  className="chat-item-avatar"
              />
              <div className="chat-info">
                <div className="chat-header-row">
                  <h4>{otherParticipant?.username || "Chat"}</h4>
                  <span className="timestamp">{formatTimestamp(chat.updatedAt)}</span>
                </div>
                <p className="last-message">
                  {chat.lastMessage === "Voice note" ? <><Mic size={14} /> Voice note</> : chat.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="floating-new-chat-btn"
        onClick={() => setShowNewChat(true)}
    >
        <Plus size={28}/>
    </button>
      <BottomNav />
      <NewChatPanel
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        conversations={conversations}
    />
    </div>
  );
};

export default Sidebar;

