'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session, SupabaseClient } from '@supabase/supabase-js'

// 1. Aggiorniamo il tipo del Context
type AuthContextType = {
  supabase: SupabaseClient
  session: Session | null
  isLoading: boolean // <-- AGGIUNTO
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true) // 2. Partiamo come "caricamento"

  useEffect(() => {
    // 3. Carichiamo la sessione iniziale
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setIsLoading(false) // 4. Finito di caricare
    }
    
    getInitialSession()

    // Ascoltiamo i cambiamenti
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setIsLoading(false) // 5. Qualsiasi evento ferma il caricamento
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    // 6. Passiamo il nuovo valore
    <AuthContext.Provider value={{ supabase, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider')
  }
  return context
}