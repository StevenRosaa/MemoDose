'use client' // 1. ORA È UN CLIENT COMPONENT

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider' // 2. IMPORTIAMO IL NOSTRO HOOK!
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const Navbar = () => {
  const { session, supabase } = useAuth() // 3. LEGGERE LA SESSIONE DAL CONTEXT
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin') // Dopo il logout, vai alla pagina di login
  }

  return (
    <nav className="flex justify-between items-center w-full h-16 px-4 md:px-8 border-b bg-background text-foreground">
      <Link href="/" className="text-xl font-bold text-primary">
        MemoDose
      </Link>

      <div className="flex items-center gap-4">
        {session ? ( // 4. Mostra dinamicamente in base al context
          <>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user.email}
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" asChild>
              <Link href="/signin">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signin">Registrati</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}