"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAppTheme } from "@/contexts/theme-context"

interface User {
  id: number
  name: string
  status: string
}

interface UsersPanelProps {
  users: User[]
}

export default function UsersPanel({ users  }: UsersPanelProps , {handleMicrophone}) {
  const { isNeonTheme, isLightTheme } = useAppTheme()

  return (
    <div className="p-4">
      <h3
        className={`font-medium mb-4 ${isNeonTheme ? "neon-text" : isLightTheme ? "text-gray-800" : "text-gray-200"}`}
      >
        Utilisateurs en ligne ({users.length})
      </h3>
      <Button
            size="icon"
            onClick={handleMicrophone}
            className={`${
              isNeonTheme
                ? "neon-button"
                : isLightTheme
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "bg-teal-600 hover:bg-teal-700"
            }`}
          ></Button>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback
                className={`${
                  isNeonTheme
                    ? "bg-blue-900 text-blue-300 neon-box"
                    : isLightTheme
                      ? "bg-gray-200 text-teal-600"
                      : "bg-gray-800 text-teal-400"
                }`}
              >
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div
                className={`font-medium ${
                  isNeonTheme ? "neon-text" : isLightTheme ? "text-gray-800" : "text-gray-200"
                }`}
              >
                {user.name}
              </div>
              <div
                className={`text-xs flex items-center ${
                  isNeonTheme ? "text-blue-500" : isLightTheme ? "text-gray-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full mr-1 ${
                    user.status === "regarde"
                      ? isNeonTheme
                        ? "bg-blue-500 neon-box"
                        : isLightTheme
                          ? "bg-teal-500"
                          : "bg-teal-500"
                      : isNeonTheme
                        ? "bg-amber-500"
                        : "bg-amber-500"
                  }`}
                ></div>
                {user.status === "regarde" ? "En train de regarder" : "Absent"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className={`w-full mt-4 ${
          isNeonTheme
            ? "neon-button"
            : isLightTheme
              ? "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-teal-600"
              : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-teal-400"
        }`}
      >
        <Plus className="h-4 w-4 mr-2" />
        Inviter des amis
      </Button>
    </div>
  )
}
