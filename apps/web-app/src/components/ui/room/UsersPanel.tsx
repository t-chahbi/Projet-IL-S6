import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface User {
  id: number
  name: string
  status: string
}

interface UsersPanelProps {
  users: User[]
}

export default function UsersPanel({ users }: UsersPanelProps) {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4 text-gray-200">Utilisateurs en ligne ({users.length})</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-gray-800 text-teal-400">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-200">{user.name}</div>
              <div className="text-xs flex items-center text-gray-400">
                <div
                  className={`h-2 w-2 rounded-full mr-1 ${user.status === "regarde" ? "bg-teal-500" : "bg-amber-500"}`}
                ></div>
                {user.status === "regarde" ? "En train de regarder" : "Absent"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-teal-400"
      >
        <Plus className="h-4 w-4 mr-2" />
        Inviter des amis
      </Button>
    </div>
  )
}

