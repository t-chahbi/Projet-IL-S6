export default function SettingsPanel() {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4 text-gray-200">Paramètres de lecture</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Synchronisation</label>
          <div className="flex items-center">
            <input type="checkbox" id="sync" className="mr-2" defaultChecked />
            <label htmlFor="sync" className="text-gray-400">
              Garder tout le monde synchronisé
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Qualité vidéo</label>
          <select className="w-full p-2 rounded-md border bg-gray-800 border-gray-700 text-gray-200">
            <option>Auto</option>
            <option>720p</option>
            <option>1080p</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Notifications de discussion</label>
          <div className="flex items-center">
            <input type="checkbox" id="notifications" className="mr-2" defaultChecked />
            <label htmlFor="notifications" className="text-gray-400">
              Afficher les notifications de discussion
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Thème</label>
          <select className="w-full p-2 rounded-md border bg-gray-800 border-gray-700 text-gray-200">
            <option>Sombre (Par défaut)</option>
            <option>Clair</option>
            <option>Système</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Langue des sous-titres</label>
          <select className="w-full p-2 rounded-md border bg-gray-800 border-gray-700 text-gray-200">
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

