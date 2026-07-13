// import { MessageSquare, Phone, Settings, User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const BottomNav = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="bottom-nav">
//       {/* <button onClick={() => navigate('/chat')}><MessageSquare size={20} /><span>Chats</span></button>
//       <button onClick={() => navigate('/calls')}><Phone size={20} /><span>Calls</span></button>
//       <button onClick={() => navigate('/settings')}><Settings size={20} /><span>Settings</span></button>
//       <button onClick={() => navigate('/profile')}><User size={20} /><span>Profile</span></button> */}
//       <button onClick={() => navigate('/chat')}><MessageSquare />Chats</button>
//       <button onClick={() => navigate('/chat/calls')}><Phone />Calls</button>
//       <button onClick={() => navigate('/chat/settings')}><Settings />Settings</button>
//       <button onClick={() => navigate('/chat/profile')}><User />Profile</button>
//     </div>
//   );
// };
// export default BottomNav;

import { MessageSquare, Phone, Settings, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-btn active' : 'nav-btn';

  return (
    <div className="bottom-nav">
      <button className={isActive('/chat')} onClick={() => navigate('/chat')}><MessageSquare size={20} /><span>Chats</span></button>
      <button className={isActive('/chat/calls')} onClick={() => navigate('/chat/calls')}><Phone size={20} /><span>Calls</span></button>
      <button className={isActive('/chat/settings')} onClick={() => navigate('/chat/settings')}><Settings size={20} /><span>Settings</span></button>
      <button className={isActive('/chat/profile')} onClick={() => navigate('/chat/profile')}><User size={20} /><span>Profile</span></button>
    </div>
  );
};
export default BottomNav;