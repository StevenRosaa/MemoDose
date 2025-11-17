import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 1. LEGGI IL PARAMETRO 'next'
  // Se c'è ?next=/qualcosa usa quello, ALTRIMENTI vai a /dashboard
  // (Prima probabilmente c'era ?? '/' qui)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 2. REINDIRIZZA ALLA DESTINAZIONE (Dashboard)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se c'è un errore, torna al login
  return NextResponse.redirect(`${origin}/signin`)
}