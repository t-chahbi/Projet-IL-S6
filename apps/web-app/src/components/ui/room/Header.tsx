"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Share2, X } from "lucide-react"
import { useAppTheme } from "@/contexts/theme-context"
import { useSocketEmit } from "@/lib/useSocket";
import { useParams } from "next/navigation";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isNeonTheme, isLightTheme } = useAppTheme()

  const { roomId } = useParams() as { roomId: string };
  const emit = useSocketEmit();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ title: string; url: string; thumbnail: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      setResults(json.items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearchOpen) return;
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchResults();
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, isSearchOpen]);

  return (
    <header
      className={`border-b p-3 transition-colors duration-300 ${
        isNeonTheme
          ? "border-blue-900 bg-gradient-to-b from-blue-900/30 to-gray-950 neon-gradient"
          : isLightTheme
            ? "border-gray-200 bg-white"
            : "border-gray-800 bg-gray-900"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1
            className={`text-2xl font-bold ${
              isNeonTheme ? "neon-text" : isLightTheme ? "text-gray-800" : "text-teal-400"
            }`}
          >
            WatchTogether
          </h1>
          {!isSearchOpen && (
            <span
              className={`hidden md:block text-xs px-2 py-1 rounded-full ${
                isNeonTheme
                  ? "bg-blue-900/50 text-blue-300 neon-box"
                  : isLightTheme
                    ? "bg-teal-100 text-teal-800"
                    : "bg-teal-900 text-teal-300"
              }`}
            >
              BÊTA
            </span>
          )}
        </div>

        {isSearchOpen ? (
          <div className="flex-1 mx-4 flex items-center relative">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.currentTarget.value)}
              placeholder="Rechercher des vidéos..."
              className={`pl-10 ${
                isNeonTheme
                  ? "neon-input"
                  : isLightTheme
                    ? "bg-gray-100 border-gray-300 text-gray-800 focus-visible:ring-teal-500"
                    : "bg-gray-800 border-gray-700 text-gray-200 focus-visible:ring-teal-500"
              }`}
              autoFocus
            />
            <Search
              className={`absolute left-3 h-4 w-4 ${
                isNeonTheme ? "text-blue-400" : isLightTheme ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <Button
              variant="ghost"
              size="icon"
              className={`ml-2 ${
                isNeonTheme
                  ? "text-blue-400 hover:text-blue-200"
                  : isLightTheme
                    ? "text-gray-500 hover:text-gray-800"
                    : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute top-full left-0 w-full mt-2 p-4 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg z-10 transition-opacity animate-fade-in">
              {isLoading ? (
                <p className="text-center text-sm text-black">Chargement...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((video) => (
                    <a
                      key={video.url}
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        emit("set-video", { roomId, videoUrl: video.url });
                        setIsSearchOpen(false);
                        setResults([]);
                      }}
                      className="group block overflow-hidden rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition"
                    >
                      <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                      <p className="mt-2 text-sm font-medium group-hover:text-teal-600 dark:group-hover:text-teal-400 px-2 text-black">{video.title}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 justify-center">
            <Button
              variant="outline"
              className={`px-4 ${
                isNeonTheme
                  ? "border-blue-800 text-blue-400 hover:text-blue-200 hover:bg-blue-900/30"
                  : isLightTheme
                    ? "border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    : "border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher des films, séries ou utilisateurs...
            </Button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {!isSearchOpen && (
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${
                isNeonTheme
                  ? "text-blue-400 hover:text-blue-200"
                  : isLightTheme
                    ? "text-gray-500 hover:text-gray-800"
                    : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`relative ${
              isNeonTheme
                ? "text-blue-400 hover:text-blue-200"
                : isLightTheme
                  ? "text-gray-500 hover:text-gray-800"
                  : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Bell className="h-5 w-5" />
            <span
              className={`absolute top-0 right-0 h-2 w-2 rounded-full ${
                isNeonTheme ? "bg-blue-500 neon-box" : isLightTheme ? "bg-teal-500" : "bg-teal-500"
              }`}
            ></span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`hidden md:flex ${
              isNeonTheme
                ? "neon-button"
                : isLightTheme
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-teal-600"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-teal-400"
            }`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Inviter
          </Button>

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Utilisateur" />
            <AvatarFallback
              className={`${
                isNeonTheme
                  ? "bg-blue-900 text-blue-300 neon-box"
                  : isLightTheme
                    ? "bg-gray-200 text-teal-600"
                    : "bg-gray-800 text-teal-400"
              }`}
            >
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
