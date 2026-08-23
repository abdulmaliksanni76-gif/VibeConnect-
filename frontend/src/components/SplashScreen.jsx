// import React, { useEffect, useState } from 'react';
// import './SplashScreen.css';
// import Vibeconnect from '../assets/Vibe Connect-2.png';

// const SplashScreen = ({ onFinish = () => {} }) => { // Default empty function
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onFinish();
//     }, 2000); 
//     return () => clearTimeout(timer);
//   }, [onFinish]);

//   return (
//     <div className="splash-screen">
//       <img src={Vibeconnect} alt="Logo" className="splash-logo" />
//     </div>
//   );
// };
// export default SplashScreen;

import React, { useEffect } from 'react';
import './SplashScreen.css';
import Vibeconnect from '../assets/Vibe Connect-2.png';

const SplashScreen = ({ onFinish = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      {/* Background effects */}
      <div className="splash-glow splash-glow-one"></div>
      <div className="splash-glow splash-glow-two"></div>
      <div className="splash-grid"></div>

      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <img
            src={Vibeconnect}
            alt="VibeConnect"
            className="splash-logo"
          />
        </div>

        <p className="splash-tagline">
          Connect. Chat. Vibe.
        </p>

        <div className="splash-loader" aria-label="Loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <p className="splash-footer">
        Bringing your people closer
      </p>
    </div>
  );
};

export default SplashScreen;