import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ username: '', photoUrl: null });
  // Add this state to force a re-fetch when we update authentication
  const [authTrigger, setAuthTrigger] = useState(false);

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  
  // If no token, just stop immediately
  if (!token) return; 

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
  } catch (err) {
    // Only log if it's not a 401/400 (which are normal if not logged in)
    if (err.response?.status !== 401 && err.response?.status !== 400) {
      console.error("Error fetching user profile", err);
    }
  }
};

  // Inside UserContext.js or wherever refreshUser is defined
const refreshUser = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // Ensure the state update includes the new photoUrl
    setUser(res.data); 
  } catch (err) {
    console.error("Failed to refresh user", err);
  }
};

useEffect(() => {
  fetchUserProfile();
  // Empty dependency array ensures this runs ONLY ONCE when the app starts
}, []);

  const triggerAuthUpdate = () => setAuthTrigger(prev => !prev);

//   return (
//     <UserContext.Provider value={{ user, setUser, refreshUser: fetchUserProfile }}>
//       {children}
//     </UserContext.Provider>
//   );
return (
//   <UserContext.Provider value={{ user, setUser, refreshUser: fetchUserProfile }}>
<UserContext.Provider value={{ user, setUser, refreshUser: fetchUserProfile, triggerAuthUpdate }}>
    {children}
  </UserContext.Provider>
);
};

export const useUser = () => useContext(UserContext);