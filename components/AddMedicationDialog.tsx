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
// Assicurati che questo import punti al tuo file types corretto
import { Medication } from '@/lib/types' 
import { useAuth } from '@/components/AuthProvider'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface AddMedicationDialogProps {
  onMedicationAdded: (newMed: Medication) => void
}

export const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  onMedicationAdded,
}) => {
  const { supabase, session } = useAuth()
  
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [time, setTime] = useState('') // Qui c'è l'ora locale (es. "13:00")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!session) {
      toast.error('Errore', { description: 'Devi essere loggato.' })
      return
    }
    if (!name || !time) {
      toast.error('Errore', { description: 'Nome e Ora sono obbligatori.' })
      return
    }
    
    setIsLoading(true)

    // 🕒 1. CONVERSIONE TEMPO (Locale -> UTC)
    // Prendiamo l'ora inserita dall'utente (es. "13:02")
    const [hours, minutes] = time.split(':')
    
    // Creiamo una data di oggi con quell'ora locale
    const dateObj = new Date()
    dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Estraiamo l'ora UTC corrispondente (es. "12:02")
    const utcHours = dateObj.getUTCHours().toString().padStart(2, '0')
    const utcMinutes = dateObj.getUTCMinutes().toString().padStart(2, '0')
    
    // Questa è la stringa che salveremo nel DB (es. "12:02:00")
    const timeToSave = `${utcHours}:${utcMinutes}:00`

    console.log(`Ora Locale: ${time}, Ora Salvata (UTC): ${timeToSave}`) // Debug log

    // 🚀 2. CHIAMATA A SUPABASE
    const { data, error } = await supabase
      .from('medications')
      .insert({
        name: name,
        dosage: dosage || null,
        time: timeToSave, // Salviamo l'orario convertito!
        user_id: session.user.id,
      })
      .select()
      .single()

    setIsLoading(false)

    if (error) {
      toast.error('Errore nel salvataggio', { description: error.message })
    } else if (data) {
      toast.success('Farmaco aggiunto!', { description: `"${name}" aggiunto.` })
      
      // Passiamo il dato al genitore così com'è (con ora UTC)
      // Il componente MedicationList si occuperà di riconvertirlo per visualizzarlo
      onMedicationAdded(data)

      // Reset
      setName('')
      setDosage('')
      setTime('')
      setIsOpen(false)
    }
  }

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
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Salvataggio...' : 'Salva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}