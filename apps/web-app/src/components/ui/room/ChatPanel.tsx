"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useAppTheme } from "@/contexts/theme-context"

interface Message {
  id: number
  user: string
  content: string
  time: string
}

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (message: string) => void
}

export default function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("")
  const { isNeonTheme, isLightTheme } = useAppTheme()

  const handleSendMessage = () => {
    onSendMessage(newMessage)
    setNewMessage("")
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className={`${
                  isNeonTheme
                    ? "bg-blue-900 text-blue-300 neon-box"
                    : isLightTheme
                      ? "bg-gray-200 text-teal-600"
                      : "bg-gray-800 text-teal-400"
                }`}
              >
                {message.user[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span
                  className={`font-medium ${
                    isNeonTheme ? "neon-text" : isLightTheme ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  {message.user}
                </span>
                <span
                  className={`text-xs ${
                    isNeonTheme ? "text-blue-600" : isLightTheme ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {message.time}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isNeonTheme ? "text-blue-400" : isLightTheme ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`p-3 border-t mt-auto ${
          isNeonTheme ? "border-blue-900" : isLightTheme ? "border-gray-200" : "border-gray-800"
        }`}
      >
        <div className="flex gap-2">
          <Input
            placeholder="Tapez un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className={`${
              isNeonTheme
                ? "neon-input"
                : isLightTheme
                  ? "bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-500 focus-visible:ring-teal-500"
                  : "bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-teal-500"
            }`}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`${
              isNeonTheme
                ? "neon-button"
                : isLightTheme
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
