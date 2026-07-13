// import React from 'react';
// import { Outlet, useParams } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import './ChatLayout.css';
// import Vibeconnect from '../assets/Vibe Connect-3.png';

// const ChatLayout = () => {
//   const { conversationId } = useParams();
//   return (
//     <div className="app-main-layout">
//       <div className={`sidebar-container ${conversationId ? 'hide-mobile' : ''}`}>
//         <Sidebar />
//       </div>
//       <div className={`chat-window-container ${!conversationId ? 'hide-mobile' : ''}`}>
//         {conversationId ? <Outlet /> : (
//           <div className="empty-chat-placeholder">
//             <div className="placeholder-content">
//               <img src={Vibeconnect} alt="Logo" className="chat-logo" />
//               <h2>Vibeconnect for Windows</h2>
//               <p>Select a chat to start messaging.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default ChatLayout;

// import React from 'react';
// import { Outlet, useParams } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import './ChatLayout.css';

// const ChatLayout = () => {
//   const { conversationId } = useParams();

  
//   return (
//     <div className="app-main-layout">
//       <div className="sidebar-container">
//         <Sidebar />
//       </div>
//       {/* <div className="chat-window-container"> */}
//       <div className={`chat-window-container ${!conversationId ? 'hide-mobile' : ''}`}>
//         {/* The Outlet now renders whatever Route matches the current URL */}
//         <Outlet />
//       </div>
//     </div>
//   );
// };
// export default ChatLayout;

import React from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './ChatLayout.css';

const ChatLayout = () => {
  const { conversationId } = useParams();
  const location = useLocation();

  // We are in "Right Panel View" if we have a conversation OR 
  // if the path is NOT just "/chat"
  const isRightPanelView = !!conversationId || location.pathname !== '/chat';

  return (
    <div className="app-main-layout">
      {/* Sidebar hides if we are in right panel view on mobile */}
      <div className={`sidebar-container ${isRightPanelView ? 'hide-mobile' : ''}`}>
        <Sidebar />
      </div>
      
      {/* Right panel shows if we are in right panel view */}
      <div className={`chat-window-container ${!isRightPanelView ? 'hide-mobile' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};
export default ChatLayout;