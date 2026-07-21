import React from "react";
import UserAvatar from "./UserAvatar";
import "./ChatHeader.css";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Mic
} from "lucide-react";

const ChatHeader = ({
  recipient,
  onlineUsers,
  isRecipientTyping,
  isRecipientRecording,
  navigate
}) => {

  const isOnline = onlineUsers.includes(recipient?._id);

  return (

<div className="chat-header">
  <button className="back-btn" onClick={() => navigate("/chat")}>
    <ArrowLeft size={22} />
  </button>

  <div className="user-info-wrapper">

    <UserAvatar
      user={recipient}
      size={52}
      className="chat-header-avatar"
    />

    <div className="user-info">
      <h3>{recipient?.username || "Chat"}</h3>

      {isRecipientRecording ? (

          <small className="recording-indicator">

              <Mic size={13} />

              Recording...

          </small>

      ) : isRecipientTyping ? (

          <small className="typing-indicator">

              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>

              Typing...

          </small>

      ) : (

          <small className="user-status">

              <span
                  className={`status-dot ${
                      isOnline ? "online" : "offline"
                  }`}
              />

              {isOnline ? "Online" : "Offline"}

          </small>

      )}
    </div>
  </div>

      <div className="chat-header-actions">

        <button className="header-btn">
          <Phone size={18}/>
        </button>

        <button className="header-btn">
          <Video size={18}/>
        </button>

        <button className="header-btn">
          <MoreVertical size={18}/>
        </button>

      </div>

    </div>


  );

};

export default ChatHeader;