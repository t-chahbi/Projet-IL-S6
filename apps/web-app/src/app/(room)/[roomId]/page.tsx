"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Settings } from "lucide-react"
import Header from "@/components/ui/room/Header"
import VideoPlayer from "@/components/ui/room/VideoPlayer"
import RecommendationsList from "@/components/ui/room/RecommendationsList"
import ChatPanel from "@/components/ui/room/ChatPanel"
import UsersPanel from "@/components/ui/room/UsersPanel"
import SettingsPanel from "@/components/ui/room/SettingsPanel"

export default function WatchTogetherPage() {
  const [messages, setMessages] = useState([
    { id: 1, user: "Ilias", content: "Cette scène est incroyable !", time: "14:45" },
    { id: 2, user: "Lucas", content: "Je sais ! La cinématographie est impressionnante.", time: "14:46" },
    { id: 3, user: "Hanane", content: "On peut revenir en arrière ? J'ai manqué quelque chose.", time: "14:48" },
  ])

  const onlineUsers = [
    { id: 1, name: "Ilias", status: "regarde" },
    { id: 2, name: "Lucas", status: "regarde" },
    { id: 3, name: "Hanane", status: "absent" },
    { id: 4, name: "Vous", status: "regarde" },
  ]

  const recommendations = [
    {
      id: 1,
      title: "Inception",
      duration: "2h 28min",
      views: "24M",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    { id: 2, title: "Matrix", duration: "2h 16min", views: "18M", thumbnail: "/placeholder.svg?height=120&width=200" },
    {
      id: 3,
      title: "Interstellar",
      duration: "2h 49min",
      views: "15M",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 4,
      title: "Blade Runner 2049",
      duration: "2h 44min",
      views: "12M",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const handleSendMessage = (newMessage: string) => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "Vous",
          content: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* Section Lecteur Vidéo */}
        <div className="flex-1 p-4 overflow-y-auto">
          <VideoPlayer title="Dune: Deuxième Partie" />

          <RecommendationsList recommendations={recommendations} />
        </div>

        {/* Barre latérale */}
        <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-3 mx-2 my-2 bg-gray-800">
              <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700 data-[state=active]:text-teal-400">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 data-[state=active]:text-teal-400">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-teal-400"
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
              <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
            </TabsContent>

            <TabsContent value="users" className="flex-1 overflow-y-auto">
              <UsersPanel users={onlineUsers} />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-y-auto">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

