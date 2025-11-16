'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider' // 1. Importiamo useAuth

export default function LoginPage() {
  const router = useRouter()
  const { supabase, session, isLoading } = useAuth() // 2. Prendiamo isLoading

  useEffect(() => {
    // 3. 🛑 NON FARE NIENTE finché l'auth non è pronto
    if (isLoading) return;

    // 4. Ora siamo sicuri. Se c'è una sessione, VAI VIA.
    if (session) {
      router.push('/')
    }
  }, [session, router, isLoading]) // 5. Aggiungiamo isLoading

  // 6. Mostriamo un loader se l'auth sta caricando
  // o se stiamo per essere reindirizzati (session è true)
  if (isLoading || session) {
    return (
      <div className="container mx-auto p-8 text-center">
        Caricamento...
      </div>
    )
  }

  // 7. Se non stiamo caricando E non c'è sessione, mostriamo il form
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['github', 'google']}
          redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
        />
      </div>
    </div>
  )
}