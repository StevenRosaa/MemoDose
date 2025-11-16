import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Creiamo il client e la risposta
  const { supabase, response } = createClient(request)

  // 2. Rinfreschiamo la sessione. Questo è il compito principale.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // 3. LOGICA DI REINDIRIZZAMENTO UNIFICATA:
  // Se l'utente NON è loggato E non sta cercando di andare a /signin
  if (!session && pathname !== '/signin') {
    // Reindirizzalo a /signin
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Se l'utente È loggato E sta cercando di andare a /signin
  if (session && pathname === '/signin') {
    // Reindirizzalo alla Home
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 4. Se va tutto bene, lascia passare l'utente
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}