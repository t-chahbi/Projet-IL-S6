"use client"
import { Button } from "@/components/ui/button"
import { useAppTheme } from "@/contexts/theme-context"
import { Check, Moon, Sun, Zap } from "lucide-react"

export default function SettingsPanel() {
  const { currentTheme, setTheme, isNeonTheme } = useAppTheme()

  const themes = [
    { id: "dark", name: "Sombre", icon: Moon },
    { id: "light", name: "Clair", icon: Sun },
    { id: "neon-blue", name: "Néon Bleu", icon: Zap },
  ]

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId)
  }

  return (
    <div className="p-4">
      <h3 className={`font-medium mb-4 ${isNeonTheme ? "neon-text" : "text-gray-200"}`}>Paramètres de lecture</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isNeonTheme ? "text-blue-300" : "text-gray-300"}`}>
            Synchronisation
          </label>
          <div className="flex items-center">
            <input type="checkbox" id="sync" className="mr-2" defaultChecked />
            <label htmlFor="sync" className={isNeonTheme ? "text-blue-400" : "text-gray-400"}>
              Garder tout le monde synchronisé
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${isNeonTheme ? "text-blue-300" : "text-gray-300"}`}>
            Qualité vidéo
          </label>
          <select
            className={`w-full p-2 rounded-md border ${isNeonTheme ? "neon-input" : "bg-gray-800 border-gray-700 text-gray-200"}`}
          >
            <option>Auto</option>
            <option>720p</option>
            <option>1080p</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${isNeonTheme ? "text-blue-300" : "text-gray-300"}`}>
            Notifications de discussion
          </label>
          <div className="flex items-center">
            <input type="checkbox" id="notifications" className="mr-2" defaultChecked />
            <label htmlFor="notifications" className={isNeonTheme ? "text-blue-400" : "text-gray-400"}>
              Afficher les notifications de discussion
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <label className={`text-sm font-medium ${isNeonTheme ? "text-blue-300" : "text-gray-300"}`}>Thème</label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => {
              const Icon = theme.icon
              const isActive = currentTheme === theme.id

              return (
                <Button
                  key={theme.id}
                  variant="outline"
                  className={`relative h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                    isActive
                      ? theme.id === "neon-blue"
                        ? "neon-button neon-pulse"
                        : theme.id === "light"
                          ? "bg-gray-100 border-gray-300 text-gray-800"
                          : "bg-gray-800 border-teal-600"
                      : theme.id === "neon-blue"
                        ? "border-blue-800 bg-transparent text-blue-400"
                        : theme.id === "light"
                          ? "border-gray-300 bg-white text-gray-700"
                          : "border-gray-700 bg-gray-900"
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  {isActive && (
                    <span className={`absolute top-1 right-1 ${theme.id === "neon-blue" ? "text-blue-300" : ""}`}>
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <Icon
                    className={`h-5 w-5 ${
                      theme.id === "neon-blue"
                        ? "text-blue-400"
                        : theme.id === "light"
                          ? "text-yellow-500"
                          : "text-gray-300"
                    }`}
                  />
                  <span className="text-xs">{theme.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${isNeonTheme ? "text-blue-300" : "text-gray-300"}`}>
            Langue des sous-titres
          </label>
          <select
            className={`w-full p-2 rounded-md border ${isNeonTheme ? "neon-input" : "bg-gray-800 border-gray-700 text-gray-200"}`}
          >
            <option>Français</option>
            <option>Anglais</option>
            <option>Espagnol</option>
            <option>Allemand</option>
          </select>
        </div>
      </div>
    </div>
  )
}
