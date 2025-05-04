'use client';

import { useState, use, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Settings } from 'lucide-react';
import Header from '@/components/ui/room/Header';
import VideoPlayer from '@/components/ui/room/VideoPlayer';
import RecommendationsList from '@/components/ui/room/RecommendationsList';
import ChatPanel from '@/components/ui/room/ChatPanel';
import UsersPanel from '@/components/ui/room/UsersPanel';
import SettingsPanel from '@/components/ui/room/SettingsPanel';
import { useAppTheme } from '@/contexts/theme-context';
import { useSocket, useSocketEvent, useSocketEmit } from '@/lib/useSocket';

export default function WatchTogetherPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { isNeonTheme, isLightTheme } = useAppTheme();
  const { roomId } = use(params);
  const socket = useSocket();
  const emitMessage = useSocketEmit('message');

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sophie',
      content: 'Cette scène est incroyable !',
      time: '14:45',
    },
    {
      id: 2,
      user: 'Thomas',
      content: 'Je sais ! La cinématographie est impressionnante.',
      time: '14:46',
    },
    {
      id: 3,
      user: 'Emma',
      content: "On peut revenir en arrière ? J'ai manqué quelque chose.",
      time: '14:48',
    },
  ]);

  // State for password modal and input
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('Film');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isSeeking = useRef(false);
  const [hasSyncedInitially, setHasSyncedInitially] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlayingState, setIsPlayingState] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const tryJoin = (password?: string) => {
      socket.emit(
        'join-room',
        { roomId, name: 'Vous', password },
        (response: {
          success: boolean;
          requiresPassword?: boolean;
          videoUrl?: string;
        }) => {
          if (!response.success && response.requiresPassword) {
            setShowPasswordModal(true);
          } else if (!response.success) {
            console.error('Failed to join room');
          } else {
            setVideoUrl(response.videoUrl || '');
          }
        }
      );
    };

    tryJoin();
  }, [socket, roomId]);

  useSocketEvent(
    'message',
    (msg: { id: number; user: string; content: string; time: string }) => {
      setMessages((prev) => [...prev, msg]);
    }
  );

  const [onlineUsers, setOnlineUsers] = useState<
    { id: string; name: string }[]
  >([]);

  useSocketEvent(
    'room-state',
    (state: {
      videoUrl: string;
      users: string[];
      currentTime: number;
      isPlaying: boolean;
    }) => {
      console.log('Room state updated:', state);
      setVideoUrl(state.videoUrl);
      const parsedTitle = state.videoUrl.split('v=')[1] || state.videoUrl;
      setVideoTitle(decodeURIComponent(parsedTitle).slice(0, 40));
      setOnlineUsers(
        state.users.map((name, index) => ({ id: `${index}`, name }))
      );
      setCurrentTimeState(state.currentTime);
      setIsPlayingState(state.isPlaying);
      if (videoRef.current) {
        const video = videoRef.current;
        // Always synchronize on first sync, and subsequently only if not seeking
        if (!isSeeking.current) {
          // Synchronize currentTime if desynced by more than 0.5s
          if (Math.abs(video.currentTime - state.currentTime) > 0.5) {
            video.currentTime = state.currentTime;
          }
          // Synchronize play/pause state
          if (state.isPlaying && video.paused) video.play();
          if (!state.isPlaying && !video.paused) video.pause();
        }
      }
      setHasSyncedInitially(true);
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (socket && video && !video.paused && !video.seeking) {
        socket.emit('sync', {
          roomId,
          currentTime: video.currentTime,
          isPlaying: true,
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, roomId, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !socket) return;

    // Unified sync event for play, pause, seeked
    const onPlay = () => {
      if (!isSeeking.current) {
        socket.emit('sync', {
          roomId,
          currentTime: video.currentTime,
          isPlaying: true,
        });
      }
    };
    const onPause = () => {
      if (!isSeeking.current) {
        socket.emit('sync', {
          roomId,
          currentTime: video.currentTime,
          isPlaying: false,
        });
      }
    };
    const onSeeked = () => {
      isSeeking.current = true;
      socket.emit('sync', {
        roomId,
        currentTime: video.currentTime,
        isPlaying: !video.paused,
      });
      setTimeout(() => {
        isSeeking.current = false;
      }, 300);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('seeked', onSeeked);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      console.log('Message reçu:', msg);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: msg.userId || 'Utilisateur inconnu',
          content: msg.message || 'Message vide',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket]);

  const handleSendMessage = (newMessage) => {
    if (newMessage.trim()) {
      const messageData = {
        roomId,
        message: newMessage,
      };

      socket.emit('send-message', messageData);
    }
  };

  const recommendations = [
    {
      id: 1,
      title: 'Inception',
      duration: '2h 28min',
      views: '24M',
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
    {
      id: 2,
      title: 'Matrix',
      duration: '2h 16min',
      views: '18M',
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
    {
      id: 3,
      title: 'Interstellar',
      duration: '2h 49min',
      views: '15M',
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
    {
      id: 4,
      title: 'Blade Runner 2049',
      duration: '2h 44min',
      views: '12M',
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
  ];

  // Password modal
  {
    showPasswordModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-6 bg-white rounded shadow-md w-80">
          <h2 className="mb-4 text-lg font-semibold">Mot de passe requis</h2>
          <input
            type="password"
            placeholder="Mot de passe"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={() => {
              socket.emit(
                'join-room',
                { roomId, name: 'Vous', password: passwordInput },
                (response: { success: boolean; videoUrl?: string }) => {
                  if (response.success) {
                    setShowPasswordModal(false);
                    setVideoUrl(response.videoUrl || '');
                  } else {
                    alert('Mot de passe incorrect.');
                  }
                }
              );
            }}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded"
          >
            Rejoindre
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        isNeonTheme
          ? 'bg-gray-950'
          : isLightTheme
          ? 'bg-gray-50 text-gray-800'
          : 'bg-gray-950 text-gray-200'
      }`}
    >
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* Section Lecteur Vidéo */}
        <div className="flex-1 p-4 overflow-y-auto">
          <VideoPlayer
            title={videoTitle}
            videoUrl={videoUrl}
            videoRef={videoRef}
            currentTime={currentTimeState}
            isPlaying={isPlayingState}
          />
          <RecommendationsList recommendations={recommendations} />
        </div>

        {/* Barre latérale */}
        <div
          className={`w-80 border-l flex flex-col transition-colors duration-300 ${
            isNeonTheme
              ? 'border-blue-900 neon-border bg-gray-950'
              : isLightTheme
              ? 'border-gray-200 bg-white'
              : 'border-gray-800 bg-gray-900'
          }`}
        >
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList
              className={`grid grid-cols-3 mx-2 my-2 ${
                isNeonTheme
                  ? 'bg-gray-900'
                  : isLightTheme
                  ? 'bg-gray-100'
                  : 'bg-gray-800'
              }`}
            >
              <TabsTrigger
                value="chat"
                className={`neon-tab ${
                  isNeonTheme
                    ? 'data-[state=active]:neon-button'
                    : isLightTheme
                    ? 'data-[state=active]:bg-white data-[state=active]:text-teal-600'
                    : 'data-[state=active]:bg-gray-700 data-[state=active]:text-teal-400'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussion
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className={`neon-tab ${
                  isNeonTheme
                    ? 'data-[state=active]:neon-button'
                    : isLightTheme
                    ? 'data-[state=active]:bg-white data-[state=active]:text-teal-600'
                    : 'data-[state=active]:bg-gray-700 data-[state=active]:text-teal-400'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`neon-tab ${
                  isNeonTheme
                    ? 'data-[state=active]:neon-button'
                    : isLightTheme
                    ? 'data-[state=active]:bg-white data-[state=active]:text-teal-600'
                    : 'data-[state=active]:bg-gray-700 data-[state=active]:text-teal-400'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="flex flex-col flex-1 overflow-hidden"
            >
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </TabsContent>

            <TabsContent value="users" className="flex-1 overflow-y-auto">
              <UsersPanel
                users={onlineUsers.map((u) => ({
                  id: u.id,
                  name: u.name,
                  status: 'regarde',
                }))}
              />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-y-auto">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
