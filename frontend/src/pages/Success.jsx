// import { useNavigate } from 'react-router-dom';
// import { CheckCircle } from 'lucide-react';

// function Success() {
//   const navigate = useNavigate();

//   return (
//     <div className="glass-card p-5 text-center" style={{ width: '100%', maxWidth: '480px' }}>
//       <div className="py-4">
//         <div className="d-flex justify-content-center mb-3">
//           <CheckCircle size={64} className="text-success" />
//         </div>
//         <h3 className="fw-bold text-white mb-2">Welcome!</h3>
//         <p className="text-white-50 mb-4">Your account is now active and ready to use.</p>
//         <button 
//           className="custom-btn w-100" 
//           onClick={() => navigate('/chat')}
//         >
//           Go to Chat
//         </button>
//       </div>
//     </div>
//   );
// }
// export default Success;

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext'; // Ensure this path is correct

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerAuthUpdate } = useUser();

  useEffect(() => {
    // If we have tokens from the navigation state, save them
    if (location.state?.token) {
      localStorage.setItem('token', location.state.token);
      localStorage.setItem('userId', location.state.userId);
      triggerAuthUpdate(); // Refresh the UserContext
    }
  }, [location.state, triggerAuthUpdate]);

  return (
    <div className="glass-card p-5 text-center" style={{ width: '100%', maxWidth: '480px' }}>
      <div className="py-4">
        <div className="d-flex justify-content-center mb-3">
          <CheckCircle size={64} className="text-success" />
        </div>
        <h3 className="fw-bold text-white mb-2">Welcome!</h3>
        <p className="text-white-50 mb-4">Your account is now active and ready to use.</p>
        <button 
          className="custom-btn w-100" 
          onClick={() => {
            // Force a full location change to clear the render state
            window.location.href = '/chat';
          }}
        >
          Go to Chat
        </button>
      </div>
    </div>
  );
}
export default Success;