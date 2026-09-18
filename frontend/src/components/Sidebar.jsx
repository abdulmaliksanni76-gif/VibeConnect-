// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useRef,
// } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import "./Sidebar.css";
// import { formatTimestamp } from "../components/dateUtils";
// import { SocketContext } from "../context/SocketContext";
// import BottomNav from "../components/BottomNav";
// import UserAvatar from "../components/UserAvatar";
// import NewChatPanel from "../components/NewChatPanel";
// import {
//   Search,
//   Mic,
//   Plus,
//   MoreVertical,
// } from "lucide-react";

// const BASE_URL = import.meta.env.VITE_API_URL || "";

// const Sidebar = () => {
//   const [conversations, setConversations] = useState([]);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showNewChat, setShowNewChat] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();
//   const { conversationId } = useParams();
//   const socket = useContext(SocketContext);

//   const menuRef = useRef(null);
//   const menuButtonRef = useRef(null);

//   const fetchConversations = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) return;

//     try {
//       const res = await axios.get(
//         `${BASE_URL}/api/chat/conversations`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setConversations(res.data);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("username");

//     window.location.href = "/login";
//   };

//   // Close the three-dot menu when clicking anywhere outside it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const clickedInsideMenu =
//         menuRef.current?.contains(event.target);

//       const clickedMenuButton =
//         menuButtonRef.current?.contains(event.target);

//       if (!clickedInsideMenu && !clickedMenuButton) {
//         setShowMenu(false);
//       }
//     };

//     if (showMenu) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("touchstart", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );

//       document.removeEventListener(
//         "touchstart",
//         handleClickOutside
//       );
//     };
//   }, [showMenu]);

//   // Fetch conversations and listen for updates
//   useEffect(() => {
//     fetchConversations();

//     if (!socket) return;

//     const refresh = () => fetchConversations();

//     socket.on("receive_message", refresh);
//     socket.on("message_updated", refresh);
//     socket.on("message_deleted", refresh);
//     socket.on("refresh_sidebar", refresh);

//     window.addEventListener("chat_updated", refresh);

//     return () => {
//       socket.off("receive_message", refresh);
//       socket.off("message_updated", refresh);
//       socket.off("message_deleted", refresh);
//       socket.off("refresh_sidebar", refresh);

//       window.removeEventListener(
//         "chat_updated",
//         refresh
//       );
//     };
//   }, [socket]);

//   const filteredChats = conversations.filter((chat) => {
//     const currentUserId = localStorage.getItem("userId");

//     const otherParticipant = chat.participants?.find(
//       (participant) =>
//         String(participant._id) !== String(currentUserId)
//     );

//     return otherParticipant?.username
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());
//   });

//   return (
//     <div className="sidebar-content">
//       {/* ================= HEADER ================= */}

//       <div className="sidebar-header">
//         <h2 className="sidebar-title">
//           VibeConnect
//         </h2>

//         <div className="sidebar-header-actions">
//           <button
//             ref={menuButtonRef}
//             type="button"
//             className={`header-icon-btn ${
//               showMenu ? "menu-active" : ""
//             }`}
//             onClick={() =>
//               setShowMenu((previous) => !previous)
//             }
//             aria-label="Open menu"
//           >
//             <MoreVertical size={22} />
//           </button>
//         </div>
//       </div>

//       {/* ================= THREE DOT MENU ================= */}

//       {showMenu && (
//         <div
//           ref={menuRef}
//           className="sidebar-popup-menu"
//         >
//           <button
//             type="button"
//             onClick={() => {
//               setShowMenu(false);
//             }}
//           >
//             New Group
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setShowMenu(false);
//             }}
//           >
//             Starred Messages
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setShowMenu(false);
//               navigate("/chat/settings");
//             }}
//           >
//             Settings
//           </button>

//           <div className="menu-divider" />

//           <button
//             type="button"
//             className="danger-item"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       )}

//       {/* ================= SEARCH ================= */}
//     <div className="sidebar-search-wrapper">
//       <div className="search-container">
//         <Search
//           className="search-icon"
//           size={18}
//         />

//         <input
//           type="text"
//           placeholder="Search chats..."
//           className="search-input"
//           value={searchQuery}
//           onChange={(e) =>
//             setSearchQuery(e.target.value)
//           }
//         />
//       </div>
//     </div>

//       {/* ================= CHAT LIST ================= */}

//       <div className="chat-list">
//         {filteredChats.length === 0 && (
//           <div className="no-chat-found">
//             <Search size={34} />

//             <h4>
//               {searchQuery
//                 ? "No chats found"
//                 : "No chats yet"}
//             </h4>

//             <p>
//               {searchQuery
//                 ? "Try searching for another username."
//                 : "Start a new conversation to begin chatting."}
//             </p>
//           </div>
//         )}

//         {filteredChats.map((chat) => {
//           const currentUserId =
//             localStorage.getItem("userId");

//           const otherParticipant =
//             chat.participants?.find(
//               (participant) =>
//                 String(participant._id) !==
//                 String(currentUserId)
//             );

//           const isActive =
//             String(chat._id) === String(conversationId);

//           return (
//             <div
//               key={chat._id}
//               className={`chat-item ${
//                 isActive ? "active-chat" : ""
//               }`}
//               onClick={() =>
//                 navigate(`/chat/${chat._id}`)
//               }
//             >
//               <UserAvatar
//                 user={otherParticipant}
//                 size={48}
//                 className="chat-item-avatar"
//               />

//               <div className="chat-info">
//                 <div className="chat-header-row">
//                   <h4>
//                     {otherParticipant?.username ||
//                       "Chat"}
//                   </h4>

//                   <span className="timestamp">
//                     {formatTimestamp(chat.updatedAt)}
//                   </span>
//                 </div>

//                 <p className="last-message">
//                   {chat.lastMessage === "Voice note" ? (
//                     <>
//                       <Mic size={14} />
//                       Voice note
//                     </>
//                   ) : (
//                     chat.lastMessage ||
//                     "No messages yet"
//                   )}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ================= NEW CHAT BUTTON ================= */}

//       <button
//         type="button"
//         className="floating-new-chat-btn"
//         onClick={() => setShowNewChat(true)}
//         aria-label="Start new chat"
//       >
//         <Plus size={25} />
//       </button>

//       {/* ================= BOTTOM NAV ================= */}

//       <BottomNav />

//       {/* ================= NEW CHAT PANEL ================= */}

//       <NewChatPanel
//         open={showNewChat}
//         onClose={() => setShowNewChat(false)}
//         conversations={conversations}
//       />
//     </div>
//   );
// };

// export default Sidebar;

import React, {
  useEffect,
  useState,
  useContext,
  useRef
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  Search,
  Mic,
  MoreVertical,
  Users,
  Star,
  Settings,
  LogOut
} from "lucide-react";

import "./Sidebar.css";

import { formatTimestamp } from "../components/dateUtils";
import { SocketContext } from "../context/SocketContext";
import BottomNav from "../components/BottomNav";
import UserAvatar from "../components/UserAvatar";
import NewChatPanel from "../components/NewChatPanel";


const BASE_URL = import.meta.env.VITE_API_URL || "";


const Sidebar = () => {

  const [conversations, setConversations] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { conversationId } = useParams();
  const socket = useContext(SocketContext);

  const menuRef = useRef(null);


  /* ==========================================================
     FETCH CONVERSATIONS
  ========================================================== */

  const fetchConversations = async () => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

      const res = await axios.get(
        `${BASE_URL}/api/chat/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setConversations(res.data);

    } catch (err) {

      console.error(
        "Fetch conversations error:",
        err
      );

    }

  };


  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    window.location.href = "/login";

  };


  /* ==========================================================
     SOCKET / CHAT REFRESH
  ========================================================== */

  useEffect(() => {

    fetchConversations();

    if (!socket) return;

    const refresh = () => {
      fetchConversations();
    };

    socket.on("receive_message", refresh);
    socket.on("message_updated", refresh);
    socket.on("message_deleted", refresh);
    socket.on("refresh_sidebar", refresh);

    window.addEventListener(
      "chat_updated",
      refresh
    );

    return () => {

      socket.off(
        "receive_message",
        refresh
      );

      socket.off(
        "message_updated",
        refresh
      );

      socket.off(
        "message_deleted",
        refresh
      );

      socket.off(
        "refresh_sidebar",
        refresh
      );

      window.removeEventListener(
        "chat_updated",
        refresh
      );

    };

  }, [socket]);


  /* ==========================================================
     CLOSE MENU WHEN CLICKING OUTSIDE
  ========================================================== */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {

        setShowMenu(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "touchstart",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "touchstart",
        handleOutsideClick
      );

    };

  }, [showMenu]);


  /* ==========================================================
     FILTER CHATS
  ========================================================== */

  const filteredChats = conversations.filter(
    (chat) => {

      const currentUserId =
        localStorage.getItem("userId");

      const otherParticipant =
        chat.participants?.find(
          (p) =>
            String(p._id) !==
            String(currentUserId)
        );

      return otherParticipant?.username
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        );

    }
  );


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <aside className="sidebar-content">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sidebar-header">

        <div className="sidebar-brand">

          <h2 className="sidebar-title">
            VibeConnect
          </h2>

          <p className="sidebar-subtitle">
            More than chats. Real connections.
          </p>

        </div>


        <div
          className="sidebar-header-actions"
          ref={menuRef}
        >

          <button
            type="button"
            className={`header-icon-btn ${
              showMenu ? "menu-open" : ""
            }`}
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
            aria-label="Open menu"
            aria-expanded={showMenu}
          >

            <MoreVertical
              size={20}
              strokeWidth={2}
            />

          </button>


          {showMenu && (

            <div className="sidebar-popup-menu">

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setShowNewChat(true);
                }}
              >

                <Users size={17} />

                <span>
                  New Group
                </span>

              </button>


              <button
                type="button"
                onClick={() =>
                  setShowMenu(false)
                }
              >

                <Star size={17} />

                <span>
                  Starred Messages
                </span>

              </button>


              <div className="sidebar-menu-divider" />


              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/chat/settings");
                }}
              >

                <Settings size={17} />

                <span>
                  Settings
                </span>

              </button>


              <button
                type="button"
                className="danger-item"
                onClick={handleLogout}
              >

                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </header>


      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="sidebar-search-wrapper">

        <div className="search-container">

          <Search
            className="search-icon"
            size={19}
            strokeWidth={2}
          />

          <input
            type="text"
            placeholder="Search chats..."
            className="search-input"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {searchQuery && (

            <button
              type="button"
              className="search-clear-btn"
              onClick={() =>
                setSearchQuery("")
              }
              aria-label="Clear search"
            >
              ×
            </button>

          )}

        </div>

      </div>


      {/* ======================================================
          CHAT LIST
      ====================================================== */}

      <div className="chat-list">

        {filteredChats.length === 0 && (

          <div className="no-chat-found">

            <div className="empty-chat-icon">
              <Search size={24} />
            </div>

            <h4>
              No chats found
            </h4>

            <p>
              Try searching for another
              username.
            </p>

          </div>

        )}


        {filteredChats.map((chat) => {

          const currentUserId =
            localStorage.getItem("userId");

          const otherParticipant =
            chat.participants?.find(
              (p) =>
                String(p._id) !==
                String(currentUserId)
            );

          const isActive =
            chat._id === conversationId;


          return (

            <div
              key={chat._id}
              className={`chat-item ${
                isActive
                  ? "active-chat"
                  : ""
              }`}
              onClick={() =>
                navigate(
                  `/chat/${chat._id}`
                )
              }
            >

              <UserAvatar
                user={otherParticipant}
                size={48}
                className="chat-item-avatar"
              />


              <div className="chat-info">

                <div className="chat-header-row">

                  <h4>
                    {
                      otherParticipant?.username ||
                      "Chat"
                    }
                  </h4>

                  <span className="timestamp">
                    {formatTimestamp(
                      chat.updatedAt
                    )}
                  </span>

                </div>


                <p className="last-message">

                  {chat.lastMessage ===
                  "Voice note" ? (

                    <>
                      <Mic size={13} />

                      <span>
                        Voice note
                      </span>
                    </>

                  ) : (

                    <span>
                      {
                        chat.lastMessage ||
                        "No messages yet"
                      }
                    </span>

                  )}

                </p>

              </div>

            </div>

          );

        })}

      </div>


      {/* ======================================================
          BOTTOM NAV + CENTER NEW CHAT
      ====================================================== */}

      <BottomNav
        onNewChat={() =>
          setShowNewChat(true)
        }
      />


      {/* ======================================================
          NEW CHAT PANEL
      ====================================================== */}

      <NewChatPanel
        open={showNewChat}
        onClose={() =>
          setShowNewChat(false)
        }
        conversations={conversations}
      />

    </aside>

  );

};


export default Sidebar;