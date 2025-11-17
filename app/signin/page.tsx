'use client'

import Image from 'next/image'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { supabase, session, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.push('/dashboard')
      router.refresh();
    }
  }, [session, router, isLoading])

  if (isLoading || session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Accesso in corso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      
      <Card className="w-full max-w-md border-border/40 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Image 
                src="/logo.svg" 
                alt="MemoDose Logo" 
                width={48} 
                height={48} 
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
              Bentornato su MemoDose
            </CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Auth
            supabaseClient={supabase}
            // 🛠️ ECCO LA CORREZIONE 🛠️
            // Usiamo le classi Tailwind dirette invece delle variabili.
            appearance={{
              theme: ThemeSupa,
              className: {
                container: 'space-y-4',
                button: 'w-full flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2', // Classi esatte di un bottone Shadcn
                input: 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', // Classi esatte di un input Shadcn
                label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5 block',
                loader: 'animate-spin',
                anchor: 'text-sm text-primary hover:underline underline-offset-4',
                divider: 'my-4 bg-border',
              },
            }}
            theme="default"
            providers={['github', 'google']}
            redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/dashboard`}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Accedi',
                  loading_button_label: 'Accesso...',
                  social_provider_text: 'Accedi con {{provider}}',
                  link_text: "Hai già un account? Accedi",
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Registrati',
                  loading_button_label: 'Registrazione...',
                  social_provider_text: 'Registrati con {{provider}}',
                  link_text: "Non hai un account? Registrati",
                }
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}