// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Camera, ArrowLeft, Check } from 'lucide-react';
// import axios from 'axios';
// import { useUser } from '../context/UserContext';
// import './Profile.css';

// const Profile = () => {
//   const navigate = useNavigate();
//   const { user, refreshUser } = useUser();
//   const fileInputRef = useRef(null);
  
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [status, setStatus] = useState("Busy, sleeping, etc.");

//   // Single source of truth for initialization and updates
//   useEffect(() => {
//     if (user) {
//       setPreviewUrl(user.photoUrl || "");
//       setDisplayName(user.username || "");
//       setStatus(user.status || "Busy, sleeping, etc.");
//     }
//   }, [user]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file)); 
//     }
//   };

//   const handleSave = async () => {
//     const formData = new FormData();
//     if (selectedFile) formData.append('profilePic', selectedFile);
//     formData.append('username', displayName);
//     formData.append('status', status);

//     try {
//       await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, formData, {
//         headers: { 
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       await refreshUser(); 
//       alert("Profile updated successfully!");
//       navigate('/chat');
//     } catch (err) {
//       console.error("Update failed", err);
//       alert("Failed to update profile");
//     }
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-content-wrapper">
//         <div className="profile-header">
//           <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={24} /></button>
//           <h2>Profile</h2>
//         </div>
        
//         <div className="avatar-section">
//           <div className="avatar-placeholder" onClick={() => fileInputRef.current.click()}>
//             {previewUrl ? (
//               <img 
//                 src={previewUrl} 
//                 alt="Profile" 
//                 style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
//               />
//             ) : (
//               <Camera size={40} color="#8696a0" />
//             )}
//           </div>
//           <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
//           <button className="change-photo-btn" onClick={() => fileInputRef.current.click()}>Change Photo</button>
//         </div>

//         <div className="profile-info">
//           <label>Display Name</label>
//           <input 
//             type="text" 
//             value={displayName} 
//             onChange={(e) => setDisplayName(e.target.value)} 
//             placeholder="Enter your display name" 
//           />
//           <label>Status</label>
//           <input 
//             type="text" 
//             value={status} 
//             onChange={(e) => setStatus(e.target.value)} 
//             placeholder="Busy, sleeping, etc." 
//           />
//         </div>

//         <button className="save-btn" onClick={handleSave}>
//           <Check size={20} /> Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };
// export default Profile;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("Busy, sleeping, etc.");
  const [isLoading, setIsLoading] = useState(false); // New Loading State

  useEffect(() => {
    if (user) {
      setPreviewUrl(user.photoUrl || "");
      setDisplayName(user.username || "");
      setStatus(user.status || "Busy, sleeping, etc.");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    setIsLoading(true); // Start loader
    const formData = new FormData();
    if (selectedFile) formData.append('profilePic', selectedFile);
    formData.append('username', displayName);
    formData.append('status', status);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, formData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await refreshUser(); 
      alert("Profile updated successfully!");
      navigate('/chat');
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div className="profile-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loader-overlay">
          <Loader2 className="spinner" size={48} />
          <p>Saving your changes...</p>
        </div>
      )}

      <div className="profile-content-wrapper">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={24} /></button>
          <h2>Profile</h2>
        </div>
        
        <div className="avatar-section">
          <div className="avatar-placeholder" onClick={() => !isLoading && fileInputRef.current.click()}>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <Camera size={40} color="#8696a0" />
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          <button className="change-photo-btn" onClick={() => fileInputRef.current.click()} disabled={isLoading}>Change Photo</button>
        </div>

        <div className="profile-info">
          <label>Display Name</label>
          <input 
            type="text" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            placeholder="Enter your display name" 
            disabled={isLoading}
          />
          <label>Status</label>
          <input 
            type="text" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            placeholder="Busy, sleeping, etc." 
            disabled={isLoading}
          />
        </div>

        <button className="save-btn" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : (
            <>
              <Check size={20} /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default Profile;