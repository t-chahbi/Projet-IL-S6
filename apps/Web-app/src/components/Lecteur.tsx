'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';

interface LecteurProps {
  videoUrl: string;
}

export default function Lecteur({ videoUrl }: LecteurProps) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      responsive: true,
      fluid: true,
      techOrder: ['youtube'],
      sources: [
        {
          src: videoUrl,
          type: 'video/youtube',
        },
      ],
    });

    player.on('error', () => {
      console.error('Erreur lors du chargement de la vidéo.');
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [videoUrl]);

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
    </div>
  );
}
