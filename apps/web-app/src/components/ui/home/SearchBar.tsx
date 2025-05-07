"use client";

import React, { useEffect, useState } from "react";
import { useSocketEmit } from "@/lib/useSocket";
import { useRouter } from "next/navigation";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [roomPassword, setRoomPassword] = useState("");
  const emitCreateRoom = useSocketEmit("create-room");
  const router = useRouter();

  const isYouTubeUrl = (q: string) =>
    /(?:youtu\.be\/|youtube\.com\/.*v=)([^&]+)/.test(q);

  const handleCreateRoom = () => {
    if (!selectedVideo) return;
    const roomId = Math.random().toString(36).substring(2, 10);
    emitCreateRoom(
      { roomId, video: selectedVideo, password: roomPassword },
      (response: { success: boolean; roomId?: string }) => {
        if (response.success && response.roomId) {
          router.push(`/${response.roomId}`);
        } else {
          alert("Erreur lors de la création de la room");
        }
      }
    );
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "" || isYouTubeUrl(query)) {
        setResults([]);
        return;
      }
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.items || []);
    };
    fetchResults();
  }, [query]);

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Recherche de vidéos 🎥</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher une vidéo ou coller une URL YouTube..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-teal-500 bg-gray-800 p-2 rounded w-full mb-4 text-white placeholder-gray-400"
        />

        {query.trim() !== "" &&
          (isYouTubeUrl(query) ? (
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  const match = query.match(
                    /(?:youtu\.be\/|youtube\.com\/.*v=)([^&]+)/
                  );
                  const id = match ? match[1] : "";
                  if (id) {
                    setSelectedVideo({
                      url: query,
                      title: `Vidéo manuelle`,
                      thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
                    });
                    setQuery("");
                    setResults([]);
                  }
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Charger la vidéo
              </button>
            </div>
          ) : (
            <div className="absolute top-full left-0 w-full mt-1 bg-gray-800 text-white rounded border border-teal-500 shadow-lg z-50 max-h-80 overflow-auto">
              {results.length === 0 ? (
                <p className="p-4 text-sm text-gray-300">
                  {query.trim() !== "" ? "Aucun résultat" : ""}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {results.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedVideo(video);
                        setQuery("");
                        setResults([]);
                      }}
                      className="group flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <span className="text-sm">{video.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 border border-teal-500 p-6 rounded shadow-md w-96 text-white">
            <h2 className="text-xl font-semibold mb-4">Créer une room</h2>
            <p className="mb-2">Vidéo sélectionnée : {selectedVideo.title}</p>
            <input
              type="password"
              placeholder="Mot de passe (optionnel)"
              className="w-full mb-4 p-2 bg-gray-700 border border-teal-500 rounded text-white placeholder-gray-400"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
