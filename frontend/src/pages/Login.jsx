// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { Mail, Lock } from 'lucide-react';
// import { useUser } from '../context/UserContext';


// const BASE_URL = import.meta.env.VITE_API_URL || ""; 

// function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { refreshUser } = useUser();



// // const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     setError(null);

// //     try {
// //       // Use the BASE_URL here
// //       const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
// //       const { data } = response;

// //       localStorage.setItem('token', data.token);
// //       localStorage.setItem('userId', data.userId);
// //       localStorage.setItem('username', data.username);
      
// //       navigate('/chat'); // Redirect to your chat page
// //     } catch (err) {
// //       setError("Login failed. Please check your credentials.");
// //       setIsSubmitting(false);
// //     }
// //   };

// const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
//       const { data } = response;

//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userId', data.userId);
//       localStorage.setItem('username', data.username);
      
//       // TRIGGER THE REFRESH HERE
//       await refreshUser(); 
      
//       navigate('/chat');
//     } catch (err) {
//       setError("Login failed. Please check your credentials.");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="glass-card">
//       <form onSubmit={handleLogin}>
//         <h3 className="text-white text-center mb-4 fw-bold">Welcome Back</h3>
        
//         {error && <p className="text-danger text-center">{error}</p>}

//         <div className="glass-input-group d-flex align-items-center">
//           <Mail size={20} className="text-primary me-3" />
//           <input 
//             className="form-control bg-transparent border-0 text-white shadow-none" 
//             placeholder="Email" 
//             required
//             onChange={(e) => setFormData({...formData, email: e.target.value})} 
//           />
//         </div>

//         <div className="glass-input-group d-flex align-items-center mb-4">
//           <Lock size={20} className="text-primary me-3" />
//           <input 
//             className="form-control bg-transparent border-0 text-white shadow-none" 
//             type="password" 
//             placeholder="Password" 
//             required
//             onChange={(e) => setFormData({...formData, password: e.target.value})} 
//           />
//         </div>

//         <button className="custom-btn w-100" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//       <p className="text-center text-white-50 mt-4 small">
//           Don't have an account? <Link to="/register" className="text-primary text-decoration-none">Create one</Link>
//       </p>
//     </div>
//   );
// }

// export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Login.css';

const BASE_URL = import.meta.env.VITE_API_URL || '';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        formData
      );

      const { data } = response;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);

      await refreshUser();

      navigate('/chat');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your email and password.'
      );

      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">

      {/* Background effects */}
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <div className="login-grid" />

      <section className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <MessageCircle size={22} strokeWidth={2.2} />
          </div>

          <span>VibeConnect</span>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <p className="login-welcome">
            WELCOME BACK
          </p>

          <h1>Good to see you again</h1>

          <p>
            Sign in to continue your conversations and stay
            connected with your people.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="login-error"
            role="alert"
          >
            <span className="login-error-dot" />

            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className="login-field">
            <label htmlFor="email">
              Email address
            </label>

            <div className="login-input-wrapper">
              <Mail
                size={19}
                className="login-input-icon"
              />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                required
                autoComplete="email"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="login-input-wrapper">
              <Lock
                size={19}
                className="login-input-icon"
              />

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={formData.password}
                required
                autoComplete="current-password"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="login-submit-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="login-spinner" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        {/* Register link */}
        <p className="login-register-text">
          Don't have an account?

          <Link to="/register">
            Create one
          </Link>
        </p>

      </section>

    </main>
  );
}

export default Login;