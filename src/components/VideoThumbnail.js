import React, { useState, useRef } from 'react';

const VideoThumbnail = ({ videoUrl, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        setError(true);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleError = () => {
    console.error('Error loading video');
    setError(true);
  };

  if (error) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '300px',
          height: '200px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        <span style={{ color: '#666' }}>Video Preview Unavailable</span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '300px',
        cursor: 'pointer',
        borderRadius: '5px',
        overflow: 'hidden'
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
        muted
        loop
        onError={handleError}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          opacity: isHovered ? 0.7 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: '15px solid #000',
              marginLeft: '3px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail; 