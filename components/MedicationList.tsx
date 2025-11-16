'use client' // 1. OBBLIGATORIO: ora è un Client Component

import React from 'react' // 2. Rimosso useState (non serve qui)
import { Medication } from '@/lib/types' // Corretto il percorso (era @/lib/types)
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu' // Import corretti
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
// Rimosso createClient (non serve, lo prende da useAuth)
import { toast } from 'sonner'
import { useAuth } from '@/components/AuthProvider' // 1. Usiamo il context

// 2. Definiamo le props
interface MedicationListProps {
  medications: Medication[]
  onMedicationDeleted: (id: number) => void
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onMedicationDeleted,
}) => {
  const { supabase } = useAuth() // 3. Prendiamo solo supabase

  const handleDeleteMedication = async (idToDelete: number) => {
    const medToDelete = medications.find((med) => med.id === idToDelete)
    
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', idToDelete)

    if (error) {
      toast.error('Errore nell\'eliminazione', { description: error.message })
    } else {
      toast.success('Farmaco eliminato!', {
        description: `"${medToDelete?.name}" è stato rimosso.`,
      })
      
      // 4. 🚀 REATTIVITÀ: Chiamiamo la funzione del genitore!
      onMedicationDeleted(idToDelete)
    }
  }
  
  if (medications.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Nessun farmaco ancora aggiunto. Clicca su "Aggiungi Farmaco" per iniziare.
      </div>
    )
  }

  return (
    <Table>
      {/* Aggiunta la testata della tabella (mancava) */}
      <TableHeader>
        <TableRow>
          <TableHead>Farmaco</TableHead>
          <TableHead>Dosaggio</TableHead>
          <TableHead>Ora</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {/* 5. Mappiamo le props */}
        {medications.map((med) => (
          <TableRow key={med.id}>
            
            {/* Aggiunta la cella Nome (mancava) */}
            <TableCell className="font-medium">{med.name}</TableCell>
            
            <TableCell>{med.dosage || '-'}</TableCell>
            <TableCell>{med.time}</TableCell>
            
            {/*
             *
             * ✅ ECCO LA CORREZIONE ✅
             * Hai bisogno dell'intera struttura del menu, 
             * non solo dell'item.
             *
             */}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMedication(med.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Elimina
                  </DropdownMenuItem>
                  {/* (Qui potresti aggiungere "Modifica") */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}