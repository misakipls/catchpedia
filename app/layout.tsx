import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Catchpedia - Your Complete Fishing Resource',
  description: 'The free fishing encyclopedia with comprehensive guides to locations, fish species, equipment, and techniques.',
  keywords: 'fishing, fishing guide, fishing locations, fish species, fishing equipment, fishing techniques',
  authors: [{ name: 'Catchpedia Team' }],
  openGraph: {
    title: 'Catchpedia - Your Complete Fishing Resource',
    description: 'The free fishing encyclopedia with comprehensive guides to locations, fish species, equipment, and techniques.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
