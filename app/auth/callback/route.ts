import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url) // Non prendiamo 'origin' da qui
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // ✅ FIX: Usa la variabile d'ambiente per essere sicuro che sia HTTPS
  // Se sei in locale userà localhost, su Vercel userà il tuo dominio https
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Scambia il codice per la sessione (questo setta i cookie)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Reindirizza usando il Base URL sicuro
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Errore? Torna al login
  return NextResponse.redirect(`${baseUrl}/signin`)
}