import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import "./AudioPlayer.css";


const AudioPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef();

useEffect(() => {
    audioRef.current = new Audio(url);

    return () => {
        audioRef.current?.pause();
    };
}, [url]);

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

  const bars = Array.from({ length:35 }, () =>
    Math.floor(Math.random()*70)+20
);

  return (
    <div className="vn-container">
      <button onClick={togglePlay} className="vn-btn">
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      
      {/* <div className={`vn-waveform ${isPlaying ? 'playing' : ''}`}> */}
      <div className={`vn-waveform ${isPlaying ? 'playing' : ''}`}>
        {/* {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="vn-bar" />
        ))} */}
        {bars.map((height,index)=>(
        <div
            key={index}
            className="vn-bar"
            style={{height:`${height}%`}}
        />
        ))}
      </div>

      <span className="vn-time">{isPlaying ? currentTime : duration}</span>
    </div>
  );
};

export default AudioPlayer;