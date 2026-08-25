// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { CheckCircle } from 'lucide-react';
// import { useUser } from '../context/UserContext'; // Ensure this path is correct

// function Success() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { triggerAuthUpdate } = useUser();

//   useEffect(() => {
//     // If we have tokens from the navigation state, save them
//     if (location.state?.token) {
//       localStorage.setItem('token', location.state.token);
//       localStorage.setItem('userId', location.state.userId);
//       triggerAuthUpdate(); // Refresh the UserContext
//     }
//   }, [location.state, triggerAuthUpdate]);

//   return (
//     <div className="glass-card p-5 text-center" style={{ width: '100%', maxWidth: '480px' }}>
//       <div className="py-4">
//         <div className="d-flex justify-content-center mb-3">
//           <CheckCircle size={64} className="text-success" />
//         </div>
//         <h3 className="fw-bold text-white mb-2">Welcome!</h3>
//         <p className="text-white-50 mb-4">Your account is now active and ready to use.</p>
        // <button 
        //   className="custom-btn w-100" 
        //   onClick={() => {
        //     // Force a full location change to clear the render state
        //     window.location.href = '/chat';
        //   }}
        // >
//           Go to Chat
//         </button>
//       </div>
//     </div>
//   );
// }
// export default Success;

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, MessageCircle, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Success.css';

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerAuthUpdate } = useUser();

  useEffect(() => {
    const saveAuthData = async () => {
      if (location.state?.token) {
        localStorage.setItem('token', location.state.token);
        localStorage.setItem('userId', location.state.userId);

        if (location.state?.username) {
          localStorage.setItem(
            'username',
            location.state.username
          );
        }

        await triggerAuthUpdate();
      }
    };

    saveAuthData();
  }, [location.state, triggerAuthUpdate]);

  const handleContinue = () => {
    navigate('/chat', { replace: true });
  };

  return (
    <main className="success-page">
      <div className="success-glow success-glow-one" />
      <div className="success-glow success-glow-two" />
      <div className="success-grid" />

      <section className="success-card">
        <div className="success-brand">
          <div className="success-brand-icon">
            <MessageCircle size={21} strokeWidth={2.2} />
          </div>

          <span>VibeConnect</span>
        </div>

        <div className="success-content">
          <div className="success-icon-wrapper">
            <div className="success-icon-ring success-ring-one" />
            <div className="success-icon-ring success-ring-two" />

            <div className="success-icon">
              <Check size={38} strokeWidth={2.7} />
            </div>
          </div>

          <p className="success-eyebrow">
            ACCOUNT VERIFIED
          </p>

          <h1>
            You're all set!
          </h1>

          <p className="success-description">
            Your account has been successfully verified.
            You're now ready to connect, chat and share
            moments with your people.
          </p>

          <div className="success-status">
            {/* <span className="success-status-dot" /> */}
            <span>Your VibeConnect account is active</span>
          </div>

          {/* <button
            type="button"
            className="success-continue-btn"
            onClick={handleContinue}
          > */}
          <button 
            className="success-continue-btn" 
            onClick={() => {
              // Force a full location change to clear the render state
              window.location.href = '/chat';
            }}
          >
            <span>Enter VibeConnect</span>

            <ArrowRight
              size={19}
              strokeWidth={2.3}
            />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Success;