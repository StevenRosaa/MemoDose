'use client'

export const Footer = () => {

    return (
        <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MemoDose. Built with Next.js & Supabase.</p>
        </footer>
    );
    
}