"use client";

import React , {useEffect, useState} from 'react'
import { useSocketEmit } from "@/lib/useSocket";
import { useRouter } from "next/navigation";

const SearchPage: React.FC=() =>{
    // pour filtrer les resultats de la recherche en fonction des mots rentrés 
    const [query,setQuery]=useState(''); // ou on va modfier query cest dans setQuery , useState('') pour remplir query avec chaine vide au debut et modifier les changements de la recherche  en temps reel  
    const [results,setResults]=useState<any[]>([]);//any[] => tableau d'objets , ([]) => on initilaise avec un tableau vide 

    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
    const [roomPassword, setRoomPassword] = useState("");
    const emitCreateRoom = useSocketEmit("create-room");
    const router = useRouter();

    const handleCreateRoom = () => {
      if (!selectedVideo) return;
      const roomId = Math.random().toString(36).substring(2, 10);
      emitCreateRoom({ roomId, video: selectedVideo, password: roomPassword }, (response: { success: boolean; roomId?: string }) => {
        if (response.success && response.roomId) {
          router.push(`/${response.roomId}`);
        } else {
          alert("Erreur lors de la création de la room");
        }
      });
    };

    useEffect(()=> {// ce bloc sexecute chaque fois query change
        const fetchResults=async() => {
            if(query.trim()==='')
            {
                setResults([]);
                return;
            }
            const res =await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);// fetch envoie une requette HTTP
            const data=await res.json();
            setResults(data.items || []);
        };
        fetchResults();
    },[query]);// react surveille la variable query et à chaque fois quelle change execute la fonction dans useEffect
    return (

        <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Recherche de vidéos 🎥</h1>
      <input
        type="text"
        placeholder="Rechercher une vidéo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border bg-transparent p-2 rounded w-full mb-4 text-black"
      />

      {query.trim() !== '' && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((video, index) => (
            <div key={index} className="border p-2 rounded bg-white">
              <img
                src={video.thumbnail} // ← C’EST ICI QU’ON AFFICHE LA PHOTO
                alt={video.title}
                className="w-32 h-auto rounded"
                />

              <button onClick={() => setSelectedVideo(video)} className="text-left text-blue-600 hover:underline">
                {video.title}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-black">Créer une room</h2>
            <p className="mb-2 text-black">Vidéo sélectionnée : {selectedVideo.title}</p>
            <input
              type="password"
              placeholder="Mot de passe (optionnel)"
              className="w-full mb-4 p-2 border rounded text-black"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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