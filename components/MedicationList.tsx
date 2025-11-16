'use client'

// Import da entrambe le versioni
import React from 'react'
import { Medication } from '@/lib/types' // Assicurati che il percorso sia corretto
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
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/AuthProvider' // Logica "Nuova"

// Props "Nuove" (con id: number)
interface MedicationListProps {
  medications: Medication[]
  onMedicationDeleted: (id: number) => void
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onMedicationDeleted,
}) => {
  // Logica "Nuova" per gestire l'eliminazione
  const { supabase } = useAuth()

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
      
      // Chiamiamo la funzione del genitore (da "Nuova")
      onMedicationDeleted(idToDelete)
    }
  }



  // JSX "Vecchio" (è questo che volevi)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Farmaco</TableHead>
          <TableHead>Dosaggio</TableHead>
          <TableHead>Ora</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.map((med) => (
          <TableRow key={med.id}>
            {/* NIENTE SPAZI QUI */}
            <TableCell className="font-medium">{med.name}</TableCell>
            {/* NIENTE SPAZI QUI */}
            <TableCell>{med.dosage || '-'}</TableCell>
            {/* NIENTE SPAZI QUI */}
            <TableCell>{med.time}</TableCell>
            {/* NIENTE SPAZI QUI */}
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
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            {/* NIENTE SPAZI QUI */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}