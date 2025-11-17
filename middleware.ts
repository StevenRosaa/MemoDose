import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Inizializza il client e prepara la risposta con i cookie sincronizzati
  const { supabase, response } = createClient(request)

  // 2. Rinfresca la sessione. 
  // getUser() è fondamentale su Vercel per validare il cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 3. 🛡️ REGOLE DI PROTEZIONE (Ecco gli IF che mancavano!)

  // A. Se NON sei loggato e provi ad andare in Dashboard -> Vai al Login
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // B. Se SEI loggato e provi a tornare al Login -> Vai alla Dashboard
  if (user && path === '/signin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // C. Se sei sulla Home (Landing Page) e sei loggato, è una tua scelta se 
  // reindirizzarlo o lasciarlo lì. Di solito si lascia lì.

  // 4. Restituisci la risposta aggiornata
  return response
}

export const config = {
  matcher: [
    /*
     * Escludiamo dal middleware:
     * - file statici, immagini, favicon
     * - manifest e icone (per la PWA)
     * - auth/callback (FONDAMENTALE: deve passare senza controlli!)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|manifest.webmanifest|manifest.json|auth/callback).*)',
  ],
}