"use client"

import Lecteur from "@/components/ui/room/Lecteur"
import { useAppTheme } from "@/contexts/theme-context"

import React from "react"

interface VideoPlayerProps {
  title: string
  videoUrl: string
  videoRef: React.RefObject<HTMLVideoElement>
  currentTime: number
  isPlaying: boolean
}

export default function VideoPlayer({ title, videoUrl, videoRef, currentTime, isPlaying }: VideoPlayerProps) {
  const { isNeonTheme, isLightTheme } = useAppTheme()

  return (
    <div>
      <div
        className={`rounded-lg overflow-hidden aspect-video shadow-lg border ${
          isNeonTheme ? "border-blue-900 neon-border" : isLightTheme ? "border-gray-300" : "border-gray-800"
        } bg-black`}
      >
        <Lecteur
          videoUrl={videoUrl}
          videoRef={videoRef}
          currentTime={currentTime}
          isPlaying={isPlaying}
        />
      </div>

      <div
        className={`mt-4 rounded-lg p-4 shadow border ${
          isNeonTheme
            ? "border-blue-900 neon-border bg-gradient-to-b from-blue-900/20 to-gray-950"
            : isLightTheme
              ? "border-gray-300 bg-white"
              : "border-gray-800 bg-gray-900"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-2 ${
            isNeonTheme ? "neon-text" : isLightTheme ? "text-teal-600" : "text-teal-400"
          }`}
        >
          {title}
        </h2>
        <p className={`${isNeonTheme ? "text-blue-400" : isLightTheme ? "text-gray-600" : "text-gray-400"}`}>
          Regardez et discutez avec vos amis en temps réel. Tous les spectateurs sont synchronisés automatiquement.
        </p>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => {
              const videoEl = videoRef.current;
              if (videoEl) {
                videoEl.paused ? videoEl.play() : videoEl.pause();
              }
            }}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isNeonTheme
                ? "neon-button"
                : isLightTheme
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            Lire
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              isNeonTheme
                ? "bg-blue-900/30 text-blue-300 border border-blue-800 hover:border-blue-700"
                : isLightTheme
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Ajouter à la liste
          </button>
        </div>
      </div>
    </div>
  )
}