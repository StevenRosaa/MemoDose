'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export const LogoutButton = () => {
  const router = useRouter()
  const supabase = createClient() // Usiamo il client BROWSER

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Ricarica la pagina. Il middleware ci "butterà" a /login
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  )
}