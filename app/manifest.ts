import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MemoDose',
    short_name: 'MemoDose',
    description: 'Il tuo assistente per la terapia farmacologica',
    start_url: '/',
    display: 'standalone', // Questo nasconde la barra del browser!
    background_color: '#ffffff',
    theme_color: '#3b82f6', // Il tuo blu primario
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}