// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { User, Mail, Lock } from 'lucide-react';
// import { registerUser } from '../services/api';

// function Register() {
//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null); // ADDED THIS LINE
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null); // Reset error before new attempt
//     try {
//       await registerUser(formData);
//       navigate('/verify', { state: { email: formData.email } });
//     } catch (error) {
//       setError(error.response?.data?.message || 'Registration Failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="glass-card">
//       <form onSubmit={handleSubmit}>
//         <h3 className="text-white text-center mb-4 fw-bold">Create Account</h3>
        
//         {error && <div className="alert alert-danger p-2 mb-3 small text-center">{error}</div>}

//         <div className="glass-input-group d-flex align-items-center">
//           <User size={20} className="text-primary me-3" />
//           <input 
//             className="form-control bg-transparent border-0 text-white shadow-none" 
//             placeholder="Username" 
//             required
//             onChange={(e) => setFormData({...formData, username: e.target.value})} 
//           />
//         </div>

//         <div className="glass-input-group d-flex align-items-center">
//           <Mail size={20} className="text-primary me-3" />
//           <input 
//             className="form-control bg-transparent border-0 text-white shadow-none" 
//             placeholder="Email Address" 
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
//           {isSubmitting ? 'Processing...' : 'Register'}
//         </button>
//       </form>

//       <p className="text-center text-white-50 mt-4 small">
//         Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login here</Link>
//       </p>
//     </div>
//   );
// }
// export default Register;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { registerUser } from '../services/api';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await registerUser(formData);

      navigate('/verify', {
        state: {
          email: formData.email
        }
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      {/* Background effects */}
      <div className="register-glow register-glow-one" />
      <div className="register-glow register-glow-two" />
      <div className="register-grid" />

      <section className="register-card">
        <div className="register-brand">
          <div className="register-brand-icon">
            <MessageCircle size={24} />
          </div>

          <span>VibeConnect</span>
        </div>

        <div className="register-heading">
          <p className="register-welcome">JOIN THE VIBE</p>

          <h1>Create your account</h1>

          <p>
            Create an account and start connecting with the
            people who matter to you.
          </p>
        </div>

        {error && (
          <div
            className="register-error"
            role="alert"
          >
            <span className="register-error-dot" />

            <p>{error}</p>
          </div>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="register-field">
            <label htmlFor="username">
              Username
            </label>

            <div className="register-input-wrapper">
              <User
                size={19}
                className="register-input-icon"
              />

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">
              Email address
            </label>

            <div className="register-input-wrapper">
              <Mail
                size={19}
                className="register-input-icon"
              />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="register-input-wrapper">
              <Lock
                size={19}
                className="register-input-icon"
              />

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
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

          <button
            className="register-submit-btn"
            type="submit"
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting
                ? 'Creating account...'
                : 'Create account'}
            </span>

            {!isSubmitting && (
              <ArrowRight size={19} />
            )}

            {isSubmitting && (
              <span className="register-spinner" />
            )}
          </button>
        </form>

        <p className="register-login-text">
          Already have an account?

          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;