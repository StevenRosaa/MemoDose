import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Questo chiama l'helper che abbiamo appena sistemato
  const { supabase, response } = createClient(request)

  // getUser() forza il refresh dei cookie se necessario
  await supabase.auth.getUser()

  // Restituisci la risposta "truccata" con i cookie sincronizzati
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|manifest.webmanifest|manifest.json|icon-.*png).*)',
  ],
}