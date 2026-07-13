import Vibeconnect from '../assets/Vibe Connect-3.png';

const ChatWelcome = () => (
  <div className="empty-chat-placeholder">
    <div className="placeholder-content">
      <img src={Vibeconnect} alt="Logo" className="chat-logo" />
      <h2>Vibeconnect for Windows</h2>
      <p>Select a chat to start messaging.</p>
    </div>
  </div>
);
export default ChatWelcome;