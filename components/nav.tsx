import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center w-full h-16 px-4 md:px-8 border-b bg-background text-foreground">
      {/* 1. Logo */}
      <Link href="/" className="text-xl font-bold text-primary">
        MemoDose
      </Link>

      {/* 2. Azioni Utente (con Shadcn) */}
      <div className="flex items-center gap-4">
        {/* Bottone "fantasma" (solo testo) per Login */}
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        
        {/* Bottone primario (solido) per Registrati */}
        <Button asChild>
          <Link href="/signup">Registrati</Link>
        </Button>
      </div>
    </nav>
  );
};