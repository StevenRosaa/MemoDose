'use client'

import Link from 'next/link'
import Image from 'next/image' // Importiamo Image per il logo
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { LogOut, User, LogIn } from 'lucide-react' // Icone per abbellire

export const Navbar = () => {
  const { session, supabase } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    // 1. HEADER MODERNO: Sticky + Effetto Vetro (Blur)
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* 2. LOGO + NOME */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          {/* Il tuo logo SVG */}
          <Image 
            src="/logo.svg" 
            alt="MemoDose Logo" 
            width={32} 
            height={32} 
            className="object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-primary hidden min-[350px]:inline-block">
            MemoDose
          </span>
        </Link>

        {/* 3. AZIONI UTENTE */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
                <User className="h-4 w-4" />
                <span>{session.user.email}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/signin">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signin">Registrati</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}