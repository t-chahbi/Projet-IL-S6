"use client";

import React , {useEffect, useState} from 'react'

const SearchPage: React.FC=() =>{
    // pour filtrer les resultats de la recherche en fonction des mots rentrés 
    const [query,setQuery]=useState(''); // ou on va modfier query cest dans setQuery , useState('') pour remplir query avec chaine vide au debut et modifier les changements de la recherche  en temps reel  
    const [results,setResults]=useState<any[]>([]);//any[] => tableau d'objets , ([]) => on initilaise avec un tableau vide 
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
      <h1 className="text-2xl font-bold mb-4">Recherche de vidéos 🎥</h1>
      <input
        type="text"
        placeholder="Rechercher une vidéo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border bg-transparent p-2 rounded w-full mb-4"
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

              <a href={video.url} target="_blank" rel="noopener noreferrer">
                {video.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
    );
};

export default SearchPage;