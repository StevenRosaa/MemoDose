import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const createClient = (request: NextRequest) => {
  // 1. Creiamo una risposta iniziale "vergine"
  // Copiamo tutti gli header per non perdere informazioni
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Impostiamo il cookie sulla RICHIESTA (così il middleware lo vede subito)
            request.cookies.set(name, value)
            // Impostiamo il cookie sulla RISPOSTA (così il browser lo salva)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  return { supabase, response }
}