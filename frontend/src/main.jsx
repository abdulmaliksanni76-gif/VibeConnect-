import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketProvider } from './context/SocketContext';
import "./styles/theme.css";
import "./styles/global.css";
import "./styles/utilities.css";

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
  </SocketProvider>
)
