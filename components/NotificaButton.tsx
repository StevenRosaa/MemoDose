'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/AuthProvider'
import { toast } from 'sonner'
import { BellRing, BellOff } from 'lucide-react'

// Chiave VAPID (deve essere nel .env.local)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY!

// Funzione helper (rimane invariata)
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

  // useEffect per controllare (rimane invariato)
  useEffect(() => {
    if (!session) return;
    checkSubscription();
  }, [session]);

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('pushManager' in window)) {
      setIsLoading(false);
      return;
    }
    const registration = await navigator.serviceWorker.ready; // Aspetta che sia pronto
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
    setIsLoading(false);
  };

  const handleSubscribe = async () => {
    if (!session) return toast.error('Devi essere loggato.');
    if (!VAPID_PUBLIC_KEY) return toast.error('Chiave di notifica non configurata.');

    setIsLoading(true);

    try {
      // 1. Chiedi il permesso
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permesso non concesso.');
      }

      // 2. Registra il Service Worker (questo avvia solo il processo)
      await navigator.serviceWorker.register('/sw.js');
      
      // 3. ⚡ LA CORREZIONE È QUI ⚡
      // Aspetta che il Service Worker sia PRONTO e ATTIVO
      const swRegistration = await navigator.serviceWorker.ready;

      // 4. Ottieni la "subscription" (ora 'swRegistration' è attivo)
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // 5. Salva l'iscrizione sul DB
      const { error } = await supabase.from('subscriptions').insert({
        user_id: session.user.id,
        subscription_details: subscription.toJSON(),
      });

      if (error) throw error;

      toast.success('Notifiche abilitate!');
      setIsSubscribed(true);
    } catch (err) {
      console.error(err);
      toast.error('Impossibile abilitare le notifiche', {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Il JSX del bottone (rimane invariato)
  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading || isSubscribed}
      variant="outline"
      size="sm"
    >
      {isSubscribed ? (
        <BellOff className="mr-2 h-4 w-4" />
      ) : (
        <BellRing className="mr-2 h-4 w-4" />
      )}
      {isSubscribed ? 'Notifiche Abilitate' : 'Attiva Notifiche'}
    </Button>
  );
};