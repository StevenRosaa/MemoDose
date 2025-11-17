'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Typewriter } from '@/components/TypeWriter'
import { BellRing, ShieldCheck, Zap, Smartphone, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Effetto Glow di sfondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="container px-4 md:px-8 mx-auto text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Novità: Notifiche Push attive
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground min-h-[160px] md:min-h-[220px] flex flex-col justify-center">
            La tua salute, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              <Typewriter text="perfettamente puntuale." speed={70} delay={500} />
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MemoDose è l'assistente intelligente che ti ricorda i tuoi farmaci. 
            Semplice, sicuro e sempre con te. Mai più una dose dimenticata.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-lg rounded-full" asChild>
              <Link href="/signin">
                Inizia Gratis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full" asChild>
              <Link href="#features">Scopri di più</Link>
            </Button>
          </div>

          {/* Mockup / Anteprima App (Stilizzata) */}
          <div className="mt-16 relative mx-auto max-w-4xl">
            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur shadow-2xl p-2 md:p-4">
              <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/20 aspect-video flex items-center justify-center relative">
                {/* Qui potresti mettere uno screenshot vero in futuro */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-background rounded-2xl shadow-lg flex items-center justify-center">
                    <Image src="/logo.svg" width={40} height={40} alt="Logo" />
                  </div>
                  <p className="text-muted-foreground font-medium">L'interfaccia di MemoDose</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES (Bento Grid Style) --- */}
      <section id="features" className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Tutto ciò che ti serve</h2>
            <p className="text-muted-foreground">Tecnologia avanzata per la tua tranquillità quotidiana.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <BellRing className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notifiche Push</h3>
              <p className="text-muted-foreground">
                Ricevi avvisi precisi su PC e Android, anche quando l'app è chiusa. Il nostro sistema Cloud non dorme mai.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sincronizzazione Istantanea</h3>
              <p className="text-muted-foreground">
                Aggiungi un farmaco dal computer, trovalo subito sul telefono. Tutto è salvato in tempo reale su Supabase.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 md:col-span-1">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy Totale</h3>
              <p className="text-muted-foreground">
                I tuoi dati sanitari sono tuoi. Usiamo la sicurezza Row Level Security per garantire che solo tu possa vederli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINALE --- */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto a semplificarti la vita?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Unisciti agli utenti che hanno già scelto MemoDose per gestire la loro terapia. È gratis.
            </p>
            <Button size="lg" className="rounded-full px-8 h-12 text-lg" asChild>
              <Link href="/signin">Crea il tuo Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}