'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';

interface LecteurProps {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  isPlaying: boolean;
}

export default function Lecteur({ videoUrl, videoRef, currentTime, isPlaying }: LecteurProps) {
  // Initialisation de la ref avec null pour satisfaire TypeScript
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  useEffect(() => {
  let shouldInit = !playerRef.current && videoRef.current &&
    (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  

  if (!shouldInit) {
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      console.error('URL non supportée par video.js avec plugin YouTube:', videoUrl);
    }
    // cleanup vide
    return () => {};
  }

  console.log("Chargement de la vidéo avec l'URL:", videoUrl);

  const player = videojs(videoRef.current!, {
    controls: true,
    autoplay: false,
    preload: 'auto',
    responsive: true,
    fluid: true,
    techOrder: ['youtube'],
    sources: [
      { src: videoUrl, type: 'video/youtube' }
    ]
  });
  playerRef.current = player;

  player.on('error', () => console.error('Erreur lors du chargement de la vidéo.'));

  const videoEl = videoRef.current!;
  player.on('play', () => videoEl.dispatchEvent(new Event('play')));
  player.on('pause', () => videoEl.dispatchEvent(new Event('pause')));
  player.on('seeked', () => videoEl.dispatchEvent(new Event('seeked')));
  player.on('timeupdate', () => {
    videoEl.currentTime = player.currentTime();
  });

  // Function de cleanup
  return () => {
    player.dispose();
    playerRef.current = null;
  };
}, [videoUrl, videoRef]);

  useEffect(() => {
    const player = playerRef.current;
    const videoEl = videoRef.current;
    if (!player || !videoEl) return;

    // Synchronisation du time si l'écart > 0.5s
    if (Math.abs(player.currentTime() - currentTime) > 0.5) {
      player.currentTime(currentTime);
    }

    // Synchronisation play/pause
    if (isPlaying && player.paused()) {
      player.play();
    } else if (!isPlaying && !player.paused()) {
      player.pause();
    }
  }, [currentTime, isPlaying, videoRef]);

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>
    </div>
  );
}
