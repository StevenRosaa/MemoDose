'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Medication } from '@/lib/types' // Assicurati che il percorso sia corretto (es. '@/types')
import { useAuth } from '@/components/AuthProvider'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

// Definiamo le props che il componente riceve
interface AddMedicationDialogProps {
  onMedicationAdded: (newMed: Medication) => void
}

export const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  onMedicationAdded,
}) => {
  const { supabase, session } = useAuth() // Prendiamo supabase e session

  // State *interno* per gestire il form
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [time, setTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    // 4. Controllo sessione
    if (!session) {
      toast.error('Errore', { description: 'Devi essere loggato.' })
      return
    }
    // Controllo campi
    if (!name || !time) {
      toast.error('Errore', { description: 'Nome e Ora sono obbligatori.' })
      return
    }
    
    setIsLoading(true)

    // 5. CHIAMATA A SUPABASE (INSERT)
    const { data, error } = await supabase
      .from('medications')
      .insert({
        name: name,
        dosage: dosage || null, // Salva null se la stringa è vuota
        time: time,
        user_id: session.user.id,
      })
      .select() // 6. Chiediamo di restituire la riga creata
      .single() // ...come singolo oggetto

    setIsLoading(false)

    if (error) {
      toast.error('Errore nel salvataggio', { description: error.message })
    } else if (data) {
      toast.success('Farmaco aggiunto!', { description: `"${name}" aggiunto.` })
      
      // 7. REATTIVITÀ: Chiamiamo la funzione del genitore (page.tsx)
      onMedicationAdded(data)

      // Reset del form e chiusura
      setName('')
      setDosage('')
      setTime('')
      setIsOpen(false)
    }
  }

  // Questo è il JSX completo dal tuo "vecchio" file
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Aggiungi Farmaco
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aggiungi un nuovo farmaco</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dosage" className="text-right">
              Dosaggio
            </Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Ora
            </Label>
            <Input
              id="time"
              type="time" // Usiamo un input di tipo "time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {/* Unica modifica al JSX: aggiunto lo stato 'isLoading' */}
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Salvataggio...' : 'Salva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}