// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/AuthProvider' // 1. IMPORTA IL PROVIDER
import { Navbar } from '@/components/nav' // La Navbar ora è qui
import { Footer } from '@/components/footer'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PillOra',
  description: 'La tua app per i promemoria farmaci',
}

// Nota: il layout NON è più async e non carica la sessione.
// Lo faremo fare alla Navbar in modo dinamico.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <AuthProvider> {/* 2. AVVOLGI L'APP */}
          
          <Navbar /> {/* 3. Mettiamo la Navbar qui, dentro il Provider */}
          
          <main>{children}</main>
          
          <Toaster />
          
          <Footer/>

        </AuthProvider> {/* 2. CHIUDI IL PROVIDER */}
      </body>
    </html>
  )
}