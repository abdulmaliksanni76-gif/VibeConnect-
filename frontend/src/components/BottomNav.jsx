// import {
//     MessageSquare,
//     Phone,
//     Settings,
//     User
// } from "lucide-react";

// import "./BottomNav.css";

// import {
//     useNavigate,
//     useLocation
// } from "react-router-dom";


// const BottomNav = () => {

//     const navigate = useNavigate();
//     const location = useLocation();


//     const navItems = [
//         {
//             label: "Chats",
//             icon: MessageSquare,
//             path: "/chat"
//         },
//         {
//             label: "Calls",
//             icon: Phone,
//             path: "/chat/calls"
//         },
//         {
//             label: "Settings",
//             icon: Settings,
//             path: "/chat/settings"
//         },
//         {
//             label: "Profile",
//             icon: User,
//             path: "/chat/profile"
//         }
//     ];


//     const isActive = (path) => {

//         if (path === "/chat") {

//             return (
//                 location.pathname === "/chat" ||
//                 (
//                     location.pathname.startsWith("/chat/") &&
//                     !location.pathname.startsWith("/chat/calls") &&
//                     !location.pathname.startsWith("/chat/settings") &&
//                     !location.pathname.startsWith("/chat/profile")
//                 )
//             );

//         }

//         return location.pathname === path;

//     };


//     return (

//         <nav
//             className="vibe-bottom-dock"
//             aria-label="Main navigation"
//         >

//             <div className="vibe-bottom-dock-inner">

//                 {navItems.map((item) => {

//                     const Icon = item.icon;

//                     const active = isActive(item.path);


//                     return (

//                         <button
//                             key={item.path}
//                             type="button"
//                             className={`vibe-nav-item ${
//                                 active ? "active" : ""
//                             }`}
//                             onClick={() =>
//                                 navigate(item.path)
//                             }
//                             aria-current={
//                                 active
//                                     ? "page"
//                                     : undefined
//                             }
//                         >

//                             <span className="vibe-nav-icon">

//                                 <Icon
//                                     size={18}
//                                     strokeWidth={
//                                         active
//                                             ? 2.1
//                                             : 1.8
//                                     }
//                                 />

//                             </span>

//                             <span className="vibe-nav-label">
//                                 {item.label}
//                             </span>

//                         </button>

//                     );

//                 })}

//             </div>

//         </nav>

//     );

// };


// export default BottomNav;

import React from "react";

import {
  MessageSquare,
  Phone,
  Settings,
  User,
  Plus
} from "lucide-react";

import "./BottomNav.css";

import {
  useNavigate,
  useLocation
} from "react-router-dom";


const BottomNav = ({ onNewChat }) => {

  const navigate = useNavigate();
  const location = useLocation();


  const leftItems = [
    {
      label: "Chats",
      icon: MessageSquare,
      path: "/chat"
    },
    {
      label: "Calls",
      icon: Phone,
      path: "/chat/calls"
    }
  ];


  const rightItems = [
    {
      label: "Settings",
      icon: Settings,
      path: "/chat/settings"
    },
    {
      label: "Profile",
      icon: User,
      path: "/chat/profile"
    }
  ];


  const isActive = (path) => {

    if (path === "/chat") {

      return (
        location.pathname === "/chat" ||
        (
          location.pathname.startsWith("/chat/") &&
          !location.pathname.startsWith("/chat/calls") &&
          !location.pathname.startsWith("/chat/settings") &&
          !location.pathname.startsWith("/chat/profile")
        )
      );

    }

    return location.pathname === path;

  };


  const renderItem = (item) => {

    const Icon = item.icon;

    const active = isActive(item.path);


    return (
      <button
        key={item.path}
        type="button"
        className={`vibe-nav-item ${
          active ? "active" : ""
        }`}
        onClick={() => navigate(item.path)}
        aria-current={
          active ? "page" : undefined
        }
      >

        <span className="vibe-nav-icon">
          <Icon
            size={23}
            strokeWidth={
              active ? 2.05 : 1.8
            }
          />
        </span>

        <span className="vibe-nav-label">
          {item.label}
        </span>

      </button>
    );
  };


  return (

    <nav
      className="vibe-bottom-nav"
      aria-label="Main navigation"
    >

      {/* LEFT SIDE */}

      <div className="vibe-nav-side">

        {leftItems.map(renderItem)}

      </div>


      {/* CENTER ACTION */}

      <button
        type="button"
        className="vibe-center-action"
        onClick={onNewChat}
        aria-label="New chat"
      >

        <span className="vibe-center-action-inner">

          <Plus
            size={29}
            strokeWidth={1.8}
          />

        </span>

      </button>


      {/* RIGHT SIDE */}

      <div className="vibe-nav-side">

        {rightItems.map(renderItem)}

      </div>

    </nav>

  );

};


export default BottomNav;