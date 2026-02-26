import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TTW Expo Map',
  description: 'Interactive map for Technical Terrain Walk Expo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
