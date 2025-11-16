'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/AuthProvider'
import { toast } from 'sonner'
import { Zap } from 'lucide-react' // Icona "Fulmine"

export const TestNotificationButton = () => {
  const { supabase, session } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleInvoke = async () => {
    if (!session) {
      toast.error('Devi essere loggato per inviare una notifica.')
      return
    }

    setIsLoading(true)
    toast.info('Invio notifica di test in corso...')

    // 🚀 ECCO IL TUO CODICE 🚀
    // Chiama la tua Edge Function "send-notifications"
    const { data, error } = await supabase.functions.invoke(
      'send-notifications', 
      {
        body: {}, // Inviamo un corpo vuoto, come nel nostro test
      }
    )

    setIsLoading(false)

    if (error) {
      toast.error('Errore nell\'invocazione', {
        description: error.message,
      })
    } else {
      // 'data' contiene la risposta dalla tua funzione (es. { message: "..." })
      console.log('Risposta dalla funzione:', data)
      toast.success('Funzione invocata!', {
        description: data.message || 'Controlla il tuo dispositivo.',
      })
    }
  }

  return (
    <Button
      variant="destructive" // Lo facciamo rosso per "test"
      onClick={handleInvoke}
      disabled={isLoading}
    >
      <Zap className="mr-2 h-4 w-4" />
      {isLoading ? 'Invio...' : 'Forza Notifica di Test'}
    </Button>
  )
}