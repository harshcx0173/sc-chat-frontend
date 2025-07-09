import React, { useState } from 'react';
import { getApiUrl } from '../utils/apiConfig';

const MediaModal = ({ isOpen, onClose, media }) => {
  const [error, setError] = useState(false);

  if (!isOpen || !media) return null;

  const fileUrl = `${getApiUrl()}/file/${media.filename}`;
  const isVideo = media.mimetype.startsWith('video/');

  const handleError = () => {
    console.error('Error loading media');
    setError(true);
  };

  if (error) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            textAlign: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ marginBottom: '15px' }}>Unable to load media</p>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '90%',
          maxHeight: '90%',
          backgroundColor: 'transparent',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            controls
            autoPlay
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              display: 'block',
            }}
            onError={handleError}
          >
            <source src={fileUrl} type={media.mimetype} />
            <source src={fileUrl} type="video/mp4" />
            <source src={fileUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={fileUrl}
            alt="Full size media"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              display: 'block',
            }}
            onError={handleError}
          />
        )}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: 0,
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <a
          href={fileUrl}
          download={media.filename}
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: 0,
            color: 'white',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '4px',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default MediaModal; 