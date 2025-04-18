import Lecteur from "@/components/ui/room/Lecteur"

interface VideoPlayerProps {
  title: string
}

export default function VideoPlayer({ title }: VideoPlayerProps) {
  return (
    <div>
      <div className="bg-black rounded-lg overflow-hidden aspect-video shadow-lg border border-gray-800">
        <Lecteur videoUrl='https://youtu.be/1GtAkWMFnyM?si=gq_G-fHFj3-sC4eB' />
      </div>

      <div className="mt-4 bg-gray-900 rounded-lg p-4 shadow border border-gray-800">
        <h2 className="text-xl font-semibold mb-2 text-teal-400">{title}</h2>
        <p className="text-gray-400">
          Regardez et discutez avec vos amis en temps réel. Tous les spectateurs sont synchronisés automatiquement.
        </p>
        <div className="flex items-center gap-3 mt-3">
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white font-medium">Lire</button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 font-medium">
            Ajouter à la liste
          </button>
        </div>
      </div>
    </div>
  )
}

