// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Verify from './pages/Verify';
// import Success from './pages/Success';
// import Login from './pages/Login';
// import Chat from './pages/Chat';
// import ChatLayout from './components/ChatLayout';
// import SplashScreen from './components/SplashScreen';

// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <SplashScreen />;
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/verify" element={<Verify />} />
//         <Route path="/success" element={<Success />} />
//         <Route path="/login" element={<Login />} />
        
//         <Route path="/chat" element={<ChatLayout />}>
//           <Route path=":conversationId" element={<Chat />} />
//         </Route>
        
//         <Route path="/" element={<Navigate to="/register" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Success from './pages/Success';
import Login from './pages/Login';
import Chat from './pages/Chat';
import ChatLayout from './components/ChatLayout';
import SplashScreen from './components/SplashScreen';
// 1. Import your new pages
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Calls from './pages/Calls';
import ChatWelcome from './components/ChatWelcome';
import { UserProvider } from './context/UserContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/chat" element={<ChatLayout />}>
          {/* Show the logo/welcome screen when at exactly /chat */}
          <Route index element={<ChatWelcome />} />
          
          {/* Show the chat interface when a specific ID is present */}
          <Route path=":conversationId" element={<Chat />} />
          
          {/* Show the new pages */}
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="calls" element={<Calls />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;