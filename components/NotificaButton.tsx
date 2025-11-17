'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/AuthProvider'
import { toast } from 'sonner'
import { BellRing, BellOff, Loader2 } from 'lucide-react'

// Chiave VAPID
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const NotificationButton = () => {
  const { supabase, session } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Controlla lo stato all'avvio
  useEffect(() => {
    if (!session) return
    checkSubscription()
  }, [session])

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsLoading(false)
      return
    }
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    // Se esiste una subscription nel browser, consideriamo l'utente iscritto
    setIsSubscribed(!!subscription)
    setIsLoading(false)
  }

  // --- LOGICA DI ISCRIZIONE (ATTIVA) ---
  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') throw new Error('Permesso negato')

      await navigator.serviceWorker.register('/sw.js')
      const swRegistration = await navigator.serviceWorker.ready

      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      // Salva nel DB
      const { error } = await supabase.from('subscriptions').insert({
        user_id: session?.user.id,
        subscription_details: subscription.toJSON(),
      })

      if (error) throw error

      toast.success('Notifiche abilitate!')
      setIsSubscribed(true)
    } catch (err) {
      console.error(err)
      toast.error('Errore attivazione notifiche')
    } finally {
      setIsLoading(false)
    }
  }

  // --- LOGICA DI DISISCRIZIONE (DISATTIVA) ---
  const handleUnsubscribe = async () => {
    setIsLoading(true)
    try {
      const swRegistration = await navigator.serviceWorker.ready
      const subscription = await swRegistration.pushManager.getSubscription()

      if (!subscription) {
        setIsSubscribed(false)
        setIsLoading(false)
        return
      }

      // 1. Rimuovi dal Database (Importante farlo prima di perdere l'endpoint)
      // Usiamo .match() per trovare la riga che contiene questo specifico endpoint JSON
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .match({ user_id: session?.user.id })
        // Questo filtro cerca dentro il JSONB la chiave 'endpoint' che corrisponde a quella attuale
        .contains('subscription_details', { endpoint: subscription.endpoint })

      if (error) {
        console.error('Errore rimozione DB:', error)
        // Non blocchiamo la disiscrizione locale anche se il DB fallisce
      }

      // 2. Rimuovi dal Browser
      await subscription.unsubscribe()

      toast.success('Notifiche disattivate.')
      setIsSubscribed(false)
    } catch (err) {
      console.error(err)
      toast.error('Impossibile disattivare le notifiche')
    } finally {
      setIsLoading(false)
    }
  }

  // Gestore del Click (Toggle)
  const handleClick = () => {
    if (!session) {
      toast.error('Devi essere loggato.')
      return
    }
    if (isSubscribed) {
      handleUnsubscribe()
    } else {
      handleSubscribe()
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Caricamento...
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleClick} 
      variant={isSubscribed ? "secondary" : "outline"} // Cambia stile se attivo
      size="sm"
      className={isSubscribed ? "text-muted-foreground" : ""}
    >
      {isSubscribed ? (
        <>
          <BellOff className="mr-2 h-4 w-4" />
          Disattiva Notifiche
        </>
      ) : (
        <>
          <BellRing className="mr-2 h-4 w-4" />
          Attiva Notifiche
        </>
      )}
    </Button>
  )
}