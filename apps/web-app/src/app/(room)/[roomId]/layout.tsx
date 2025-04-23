import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WatchTogether - Regardez des vidéos avec vos amis",
  description: "Plateforme de visionnage synchronisé pour regarder des vidéos avec vos amis en temps réel",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}