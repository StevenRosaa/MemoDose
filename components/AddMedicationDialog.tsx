// src/components/AddMedicationDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Medication } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider' // 1. Usiamo il context
import { toast } from 'sonner'
import { Plus } from 'lucide-react'; // Icona "+"

// 🧠 CONCETTO REACT: "Props"
interface AddMedicationDialogProps {
  onMedicationAdded: (newMed: Medication) => void
}

export const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  onMedicationAdded,
}) => {
  const { supabase, session } = useAuth() // 3. Prendiamo supabase e session
  
  // ... (i tuoi useState per name, dosage, time, isOpen, isLoading)
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [time, setTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    // 4. Controllo sessione (ora è istantaneo!)
    if (!session) {
      toast.error('Errore', { description: 'Devi essere loggato.' })
      return
    }
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
        dosage: dosage || null,
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
      
      // 7. 🚀 REATTIVITÀ: Chiamiamo la funzione del genitore!
      // Non usiamo più router.refresh(). Aggiorniamo lo stato.
      onMedicationAdded(data)

      // Reset del form e chiusura
      setName('')
      setDosage('')
      setTime('')
      setIsOpen(false)
    }
  }

  return (
    // ... (tutto il tuo JSX del Dialog non cambia)
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* ... (Header, Content, Footer) ... */}
    </Dialog>
  )
}