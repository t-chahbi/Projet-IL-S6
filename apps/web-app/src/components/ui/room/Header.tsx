"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Share2, X } from "lucide-react"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 p-3 bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-teal-400">WatchTogether</h1>
          {!isSearchOpen && (
            <span className="hidden md:block text-xs px-2 py-1 bg-teal-900 text-teal-300 rounded-full">BÊTA</span>
          )}
        </div>

        {isSearchOpen ? (
          <div className="flex-1 mx-4 flex items-center relative">
            <Input
              placeholder="Rechercher des films, séries ou utilisateurs..."
              className="bg-gray-800 border-gray-700 text-gray-200 pl-10 focus-visible:ring-teal-500"
              autoFocus
            />
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-gray-400 hover:text-gray-200"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 justify-center">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-800 px-4"
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
              className="md:hidden text-gray-400 hover:text-gray-200"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-teal-500 rounded-full"></span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-teal-400"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Inviter
          </Button>

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Utilisateur" />
            <AvatarFallback className="bg-gray-800 text-teal-400">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

