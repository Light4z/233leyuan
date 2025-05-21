import React, { useState, useRef } from 'react';

export default function PostCard({ post }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (post.isVideo) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="post-card">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>
      <div className="post-media" onClick={togglePlay}>
        {post.isVideo ? (
          <>
            <video
              ref={videoRef}
              src={post.media}
              loop
              muted={false}
              playsInline
              className="video-element"
            />
            {!isPlaying && (
              <div className="play-button">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              </div>
            )}
          </>
        ) : (
          <img src={post.media} alt="帖子图片" className="post-image" />
        )}
      </div>
    </div>
  );
}