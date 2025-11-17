import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Crea client e sessione
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // 2. REGOLE DI PROTEZIONE

  // A. Utente NON loggato prova ad accedere a rotte protette (/dashboard)
  if (!session && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // B. Utente LOGGATO prova ad accedere a pagine auth (/signin) 
  //    Opzionale: puoi reindirizzarlo anche se va sulla Home (/)
  if (session && (path === '/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Esegui il middleware su tutto tranne file statici e API
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}