// // import React from 'react';
// import { Outlet, useParams, useLocation } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import './ChatLayout.css';
// import React, { useEffect } from 'react';
// import { enableNotifications } from '../utils/notifications';

// const ChatLayout = () => {
//   const { conversationId } = useParams();
//   const location = useLocation();

//   // We are in "Right Panel View" if we have a conversation OR 
//   // if the path is NOT just "/chat"
//   const isRightPanelView = !!conversationId || location.pathname !== '/chat';

//   return (
//     <div className="app-main-layout">
//       {/* Sidebar hides if we are in right panel view on mobile */}
//       <div className={`sidebar-container ${isRightPanelView ? 'hide-mobile' : ''}`}>
//         <Sidebar />
//       </div>
      
//       {/* Right panel shows if we are in right panel view */}
//       <div className={`chat-window-container ${!isRightPanelView ? 'hide-mobile' : ''}`}>
//         <Outlet />
//       </div>
//     </div>
//   );
// };
// export default ChatLayout;

// import React, { useEffect } from 'react';
// import { Outlet, useParams, useLocation } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import './ChatLayout.css';
// import { enableNotifications } from '../utils/notifications';

// const ChatLayout = () => {
//   const { conversationId } = useParams();
//   const location = useLocation();

//   // We are in "Right Panel View" if we have a conversation OR
//   // if the path is NOT just "/chat"
//   const isRightPanelView =
//     !!conversationId || location.pathname !== '/chat';

//   useEffect(() => {
//     const setupNotifications = async () => {
//       console.log('ChatLayout loaded');
//       console.log(
//         'Current notification permission:',
//         Notification.permission
//       );

//       // Only request permission if the user has not
//       // already allowed or denied notifications
//       if (
//         'Notification' in window &&
//         Notification.permission === 'default'
//       ) {
//         console.log('Requesting notification permission...');

//         const result = await enableNotifications();

//         console.log(
//           'Notification setup result:',
//           result
//         );
//       } else {
//         console.log(
//           'Notification permission already decided:',
//           Notification.permission
//         );
//       }
//     };

//     setupNotifications();
//   }, []);

//   return (
//     <div className="app-main-layout">

//       {/* Sidebar */}
//       <div
//         className={`sidebar-container ${
//           isRightPanelView ? 'hide-mobile' : ''
//         }`}
//       >
//         <Sidebar />
//       </div>

//       {/* Right panel */}
//       <div
//         className={`chat-window-container ${
//           !isRightPanelView ? 'hide-mobile' : ''
//         }`}
//       >
//         <Outlet />
//       </div>

//     </div>
//   );
// };

// export default ChatLayout;

import React, { useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './ChatLayout.css';
import { enableNotifications } from '../utils/notifications';

const ChatLayout = () => {
  const { conversationId } = useParams();
  const location = useLocation();

  // We are in "Right Panel View" if we have a conversation OR
  // if the path is NOT just "/chat"
  const isRightPanelView =
    !!conversationId || location.pathname !== '/chat';

  useEffect(() => {
    const setupNotifications = async () => {
      console.log('=================================');
      console.log('🔔 ChatLayout loaded');
      console.log('=================================');

      // Check browser support
      if (!('Notification' in window)) {
        console.log(
          '❌ This browser does not support notifications.'
        );
        return;
      }

      console.log(
        'Current notification permission:',
        Notification.permission
      );

      // Always call enableNotifications.
      // The function itself handles:
      // - default permission
      // - granted permission
      // - denied permission
      const result = await enableNotifications();

      console.log(
        'Notification setup result:',
        result
      );
    };

    setupNotifications();
  }, []);

  return (
    <div className="app-main-layout">

      {/* Sidebar */}
      <div
        className={`sidebar-container ${
          isRightPanelView ? 'hide-mobile' : ''
        }`}
      >
        <Sidebar />
      </div>

      {/* Right panel */}
      <div
        className={`chat-window-container ${
          !isRightPanelView ? 'hide-mobile' : ''
        }`}
      >
        <Outlet />
      </div>

    </div>
  );
};

export default ChatLayout;