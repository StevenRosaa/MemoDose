import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 1. CERCA IL PARAMETRO 'next'. 
  // Se non c'è, forza il default a '/dashboard' (non '/')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 2. REINDIRIZZA ALLA DESTINAZIONE CORRETTA
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se c'è un errore, torna al login
  return NextResponse.redirect(`${origin}/signin`)
}