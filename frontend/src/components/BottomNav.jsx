// import { MessageSquare, Phone, Settings, User } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const BottomNav = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path ? 'nav-btn active' : 'nav-btn';

//   return (
//     <div className="bottom-nav">
//       <button className={isActive('/chat')} onClick={() => navigate('/chat')}><MessageSquare size={20} /><span>Chats</span></button>
//       <button className={isActive('/chat/calls')} onClick={() => navigate('/chat/calls')}><Phone size={20} /><span>Calls</span></button>
//       <button className={isActive('/chat/settings')} onClick={() => navigate('/chat/settings')}><Settings size={20} /><span>Settings</span></button>
//       <button className={isActive('/chat/profile')} onClick={() => navigate('/chat/profile')}><User size={20} /><span>Profile</span></button>
//     </div>
//   );
// };
// export default BottomNav;

import {
    MessageSquare,
    Phone,
    Settings,
    User
} from "lucide-react";
import './BottomNav.css'
import {
    useNavigate,
    useLocation
} from "react-router-dom";

const BottomNav = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const navItems = [

        {
            label:"Chats",
            icon:MessageSquare,
            path:"/chat"
        },

        {
            label:"Calls",
            icon:Phone,
            path:"/chat/calls"
        },

        {
            label:"Settings",
            icon:Settings,
            path:"/chat/settings"
        },

        {
            label:"Profile",
            icon:User,
            path:"/chat/profile"
        }

    ];

    return(

        <div className="bottom-nav">

            {navItems.map((item)=>{

                const Icon=item.icon;

                const active=
                    location.pathname===item.path;

                return(

                    <button

                        key={item.path}

                        className={`nav-btn ${active?"active":""}`}

                        onClick={()=>navigate(item.path)}

                    >

                        <Icon size={18}/>

                        <span>

                            {item.label}

                        </span>

                    </button>

                );

            })}

        </div>

    );

};

export default BottomNav;