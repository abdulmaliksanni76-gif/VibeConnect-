// import { createContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';

// export const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:5000");
//     setSocket(newSocket);
//     return () => newSocket.close();
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

// Use the same logic as your api.js for consistency
const SOCKET_URL = import.meta.env.MODE === 'production' 
  ? "" // Empty string tells socket.io to connect to the current production domain
  : "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect using the dynamic URL
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"], // Ensures stability in production
      path: "/socket.io"        // Standard path for socket.io
    });
    
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};