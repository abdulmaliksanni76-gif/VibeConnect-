// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useUser } from '../context/UserContext'; // Adjust path if necessary


// // Define the base URL
// const BASE_URL = import.meta.env.VITE_API_URL || "";


// function Verify() {
//   const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
//   const [resending, setResending] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;
//   const { triggerAuthUpdate } = useUser();

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]$/.test(value) || value === '') {
//       const newOtpArray = [...otpArray];
//       newOtpArray[index] = value;
//       setOtpArray(newOtpArray);
//       if (value !== '' && index < 5) document.getElementById(`otp-${index + 1}`).focus();
//     }
//   };

//   // const handleVerify = async () => {
//   //   try {
//   //     await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: otpArray.join('') });
//   //     navigate('/success');
//   //   } catch (error) {
//   //     alert('Verification Failed');
//   //   }
//   // };

// //   const handleVerify = async () => {
// //   try {
// //     // Expecting the backend to return { token, userId }
// //     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { 
// //       email, 
// //       otp: otpArray.join('') 
// //     });

// //     // Save tokens IMMEDIATELY upon successful verification
// //     if (res.data.token) {
// //       localStorage.setItem('token', res.data.token);
// //       localStorage.setItem('userId', res.data.userId);
// //     }

// //     // Now navigate to chat, and the Sidebar will be authenticated
// //     navigate('/chat'); 
// //   } catch (error) {
// //     alert('Verification Failed');
// //   }
// // };

// // const handleVerify = async () => {
// //   try {
// //     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { 
// //       email, 
// //       otp: otpArray.join('') 
// //     });

// //     // Save tokens IMMEDIATELY
// //     localStorage.setItem('token', res.data.token);
// //     localStorage.setItem('userId', res.data.userId);

// //     // Redirect to chat
// //     navigate('/chat'); 
// //   } catch (error) {
// //     alert('Verification Failed: ' + (error.response?.data?.message || 'Invalid code'));
// //   }
// // };

// // Inside Verify.jsx
// // const handleVerify = async () => {
// //   try {
// //     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: otpArray.join('') });
    
// //     // Save tokens IMMEDIATELY
// //     localStorage.setItem('token', res.data.token);
// //     localStorage.setItem('userId', res.data.userId);
    
// //     // Now redirect to chat. The Sidebar will now have the token ready!
// //     navigate('/chat');
// //   } catch (error) {
// //     alert('Verification Failed');
// //   }
// // };

// // const handleVerify = async () => {
// //   try {
// //     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: otpArray.join('') });

// //     // 1. Save to Storage
// //     localStorage.setItem('token', res.data.token);
// //     localStorage.setItem('userId', res.data.userId);

// //     // 2. Trigger the Context to re-fetch immediately
// //     triggerAuthUpdate(); 

// //     // 3. Now navigate
// //     navigate('/chat');
// //   } catch (error) {
// //     alert('Verification Failed');
// //   }
// // };

// // Verify.jsx
// // const handleVerify = async () => {
// //   try {
// //     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: otpArray.join('') });
    
// //     // 1. Save data
// //     localStorage.setItem('token', res.data.token);
// //     localStorage.setItem('userId', res.data.userId);

// //     // 2. FORCE the Context to re-initialize
// //     triggerAuthUpdate(); 
    
// //     // 3. Only now navigate
// //     navigate('/chat');
// //   } catch (err) {
// //     alert("Verification failed");
// //   }
// // };

// const handleVerify = async () => {
//   try {
//     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp: otpArray.join('') });
    
//     // Pass tokens to success page
//     navigate('/success', { 
//       state: { token: res.data.token, userId: res.data.userId } 
//     });
//   } catch (error) {
//     alert('Verification Failed');
//   }
// };

//   const handleResend = async () => {
//     setResending(true);
//     try {
//       await axios.post(`${BASE_URL}/api/auth/resend-otp`, { email });
//       alert('A new code has been sent to your email.');
//     } catch (error) {
//       alert('Failed to resend. Please try again.');
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div className="glass-card p-5" style={{ width: '100%', maxWidth: '480px' }}>
//       <div className="text-center">
//         <h3 className="text-white mb-3 fw-bold">Verify Email</h3>
//         <p className="text-white-50 small mb-4">We've sent a code to your email.</p>
        
//         <div className="d-flex justify-content-center gap-2 mb-4">
//           {otpArray.map((digit, index) => (
//           <input 
//             key={index} 
//             id={`otp-${index}`} 
//             type="text" 
//             maxLength="1" 
//             className="form-control text-center fs-3 otp-input text-white shadow-none" 
//             style={{ width: '55px', height: '65px', padding: '0', fontSize: '1.5rem', borderRadius: '12px' }} 
//             value={digit} 
//             onChange={(e) => handleOtpChange(e, index)} 
//           />
//         ))}
//         </div>

//         <button onClick={handleVerify} className="custom-btn w-100 mb-3">Verify Account</button>
        
//         <p className="text-white-50 small mt-3">
//           Didn't receive the code?{' '}
//           <button 
//             onClick={handleResend} 
//             className="btn btn-link p-0 border-0 text-primary text-decoration-none" 
//             disabled={resending}
//           >
//             {resending ? 'Sending...' : 'Resend it'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }
// export default Verify;

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck,
  Mail,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import './Verify.css';

const BASE_URL = import.meta.env.VITE_API_URL || '';

function Verify() {
  const [otpArray, setOtpArray] = useState([
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);


  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);


  const handleOtpChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, '');

    setError('');
    setSuccessMessage('');

    // Handle pasted multiple digits
    if (value.length > 1) {
      const pastedDigits = value
        .slice(0, 6 - index)
        .split('');

      const newOtpArray = [...otpArray];

      pastedDigits.forEach((digit, digitIndex) => {
        newOtpArray[index + digitIndex] = digit;
      });

      setOtpArray(newOtpArray);

      const nextIndex = Math.min(
        index + pastedDigits.length,
        5
      );

      inputRefs.current[nextIndex]?.focus();

      return;
    }

    const newOtpArray = [...otpArray];

    newOtpArray[index] = value;

    setOtpArray(newOtpArray);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };


  const handleKeyDown = (event, index) => {
    if (
      event.key === 'Backspace' &&
      !otpArray[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === 'ArrowRight' &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };


  const handleVerify = async () => {
    const otp = otpArray.join('');

    setError('');
    setSuccessMessage('');

    if (otp.length !== 6) {
      setError(
        'Please enter the complete 6-digit verification code.'
      );
      return;
    }

    setIsVerifying(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/verify-otp`,
        {
          email,
          otp
        }
      );

      navigate('/success', {
        state: {
          token: res.data.token,
          userId: res.data.userId
        }
      });

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Verification failed. Please check the code and try again.'
      );

      setOtpArray([
        '',
        '',
        '',
        '',
        '',
        ''
      ]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);

    } finally {
      setIsVerifying(false);
    }
  };


  const handleResend = async () => {
    if (resending || cooldown > 0) {
      return;
    }

    setError('');
    setSuccessMessage('');
    setResending(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/resend-otp`,
        { email }
      );

      setSuccessMessage(
        response.data?.message ||
        'A new verification code has been sent to your email.'
      );

      setCooldown(60);

      setOtpArray([
        '',
        '',
        '',
        '',
        '',
        ''
      ]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Failed to resend the verification code. Please try again.'
      );

    } finally {
      setResending(false);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    handleVerify();
  };


  return (
    <main className="verify-page">

      <div className="verify-glow verify-glow-one" />
      <div className="verify-glow verify-glow-two" />
      <div className="verify-grid" />

      <section className="verify-card">

        {/* BRAND */}
        <div className="verify-brand">
          <div className="verify-brand-icon">
            <ShieldCheck size={20} />
          </div>

          <span>VibeConnect</span>
        </div>


        {/* HEADING */}
        <div className="verify-heading">

          <p className="verify-label">
            EMAIL VERIFICATION
          </p>

          <h1>
            Verify your email
          </h1>

          <p className="verify-description">
            We sent a 6-digit verification code to{' '}
            <span className="verify-email">
              {email}
            </span>
          </p>

        </div>


        {/* ERROR */}
        {error && (
          <div className="verify-message error">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}


        {/* SUCCESS */}
        {successMessage && (
          <div className="verify-message success">
            <CheckCircle2 size={18} />
            <p>{successMessage}</p>
          </div>
        )}


        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="verify-otp-container">

            {otpArray.map((digit, index) => (
              <input
                key={index}

                ref={(element) => {
                  inputRefs.current[index] = element;
                }}

                type="text"
                inputMode="numeric"
                autoComplete={
                  index === 0
                    ? 'one-time-code'
                    : 'off'
                }

                maxLength={6}

                className="verify-otp-input"

                value={digit}

                onChange={(event) =>
                  handleOtpChange(event, index)
                }

                onKeyDown={(event) =>
                  handleKeyDown(event, index)
                }

                onFocus={(event) =>
                  event.target.select()
                }

                aria-label={`OTP digit ${index + 1}`}
              />
            ))}

          </div>


          {/* VERIFY BUTTON */}
          <button
            type="submit"
            className="verify-submit-btn"
            disabled={isVerifying}
          >

            {isVerifying ? (
              <>
                <span className="verify-spinner" />
                Verifying...
              </>
            ) : (
              'Verify account'
            )}

          </button>

        </form>


        {/* RESEND */}
        <p className="verify-resend-text">

          Didn't receive the code?

          <button
            type="button"
            className="verify-resend-btn"
            onClick={handleResend}
            disabled={
              resending ||
              cooldown > 0
            }
          >

            {resending
              ? 'Sending...'
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend code'}

          </button>

        </p>

      </section>

    </main>
  );
}

export default Verify;