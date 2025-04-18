interface Recommendation {
  id: number
  title: string
  duration: string
  views: string
  thumbnail: string
}

interface RecommendationsListProps {
  recommendations: Recommendation[]
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">Recommandé pour vous</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-teal-700 transition-colors cursor-pointer group"
          >
            <div className="relative">
              <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} className="w-full h-28 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-200 group-hover:text-teal-400 transition-colors">{item.title}</h4>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{item.duration}</span>
                <span>{item.views} vues</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

