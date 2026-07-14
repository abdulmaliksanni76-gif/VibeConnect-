// import React, { useState, useRef, useEffect } from 'react';
// import { Play, Pause } from 'lucide-react';

// const AudioPlayer = ({ url }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(new Audio(url));

//   useEffect(() => {
//     audioRef.current.onended = () => setIsPlaying(false);
//   }, [url]);

//   const togglePlay = () => {
//     isPlaying ? audioRef.current.pause() : audioRef.current.play();
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className="vn-container">
//       <button onClick={togglePlay} className="vn-btn">
//         {isPlaying ? <Pause size={12} fill="currentColor" strokeWidth={3} /> : <Play size={12} fill="currentColor" strokeWidth={3} />}
//       </button>
      
//       <div className="vn-waveform">
//         {Array.from({ length: 20 }).map((_, i) => (
//           <div key={i} className="vn-bar" style={{ height: `${Math.random() * 10 + 4}px` }}></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;

// import React, { useState, useRef, useEffect } from 'react';
// import { Play, Pause } from 'lucide-react';

// const AudioPlayer = ({ url }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState("0:00");
//   const [currentTime, setCurrentTime] = useState("0:00");
//   const audioRef = useRef(new Audio(url));

//   useEffect(() => {
//     const audio = audioRef.current;
    
//     const updateTime = () => {
//       const mins = Math.floor(audio.currentTime / 60);
//       const secs = Math.floor(audio.currentTime % 60);
//       setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
//     };

//     const setMeta = () => {
//       const mins = Math.floor(audio.duration / 60);
//       const secs = Math.floor(audio.duration % 60);
//       setDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
//     };

//     audio.addEventListener('timeupdate', updateTime);
//     audio.addEventListener('loadedmetadata', setMeta);
//     audio.onended = () => setIsPlaying(false);

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//       audio.removeEventListener('loadedmetadata', setMeta);
//     };
//   }, [url]);

//   const togglePlay = () => {
//     isPlaying ? audioRef.current.pause() : audioRef.current.play();
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className="vn-container">
//       <button onClick={togglePlay} className="vn-btn">
//         {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
//       </button>
      
//       <div className={`vn-waveform ${isPlaying ? 'playing' : ''}`}>
//         {Array.from({ length: 35 }).map((_, i) => ( // Increased to 35 bars
//           <div key={i} className="vn-bar" />
//         ))}
//       </div>

//       {/* Timer display */}
//       <span className="vn-time">{isPlaying ? currentTime : duration}</span>
//     </div>
//   );
// };

// export default AudioPlayer;

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef(new Audio(url));

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => {
      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60);
      setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    const setMeta = () => {
      if (isNaN(audio.duration)) return;
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      setDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setMeta);
    audio.onended = () => setIsPlaying(false);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setMeta);
    };
  }, [url]);

  const togglePlay = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="vn-container">
      <button onClick={togglePlay} className="vn-btn">
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      
      <div className={`vn-waveform ${isPlaying ? 'playing' : ''}`}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="vn-bar" />
        ))}
      </div>

      <span className="vn-time">{isPlaying ? currentTime : duration}</span>
    </div>
  );
};

export default AudioPlayer;