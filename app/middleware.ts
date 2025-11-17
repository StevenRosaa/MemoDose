import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Inizializza client e risposta
  const { supabase, response } = createClient(request)

  // 2. ⚠️ IMPORTANTE: Usa getUser() invece di getSession()
  // getUser() è più sicuro e forza l'aggiornamento dei cookie,
  // prevenendo il loop infinito su Vercel.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 3. REGOLE DI REINDIRIZZAMENTO

  // A. Utente NON loggato prova ad andare nella Dashboard
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // B. Utente LOGGATO prova ad andare al Login
  if (user && path === '/signin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 4. Aggiorna la sessione e restituisci la risposta con i cookie nuovi
  return response
}

export const config = {
  matcher: [
    /*
     * Applica a tutto TRANNE:
     * - api routes
     * - file statici (_next/static, _next/image)
     * - favicon, manifest, icone
     * - auth callback (fondamentale per non bloccare il login)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|icon-.*png|auth/callback).*)',
  ],
}