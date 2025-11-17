'use client'

import React from 'react'
import { Medication } from '@/lib/types'
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
import { MoreHorizontal, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/AuthProvider'

interface MedicationListProps {
  medications: Medication[]
  onMedicationDeleted: (id: number) => void
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onMedicationDeleted,
}) => {
  const { supabase } = useAuth()

  // 🕒 FUNZIONE DI CONVERSIONE ORA (Il Cuore della modifica)
  // Prende l'ora UTC dal DB (es. "12:00:00") e la mostra locale (es. "13:00")
  const formatLocalTime = (utcTimeString: string) => {
    if (!utcTimeString) return '--:--';

    // 1. Scomponiamo l'ora del database (che sappiamo essere UTC)
    const [hours, minutes] = utcTimeString.split(':');

    // 2. Creiamo una data di "oggi"
    const date = new Date();

    // 3. Impostiamo l'ora UTC su quella data
    // (Nota: usiamo setUTCHours, non setHours!)
    date.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

    // 4. Chiediamo al browser di formattarla nell'ora locale dell'utente
    // Questo userà automaticamente il fuso orario del tuo computer (Italia)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Usa formato 24h (13:00 invece di 1:00 PM)
    });
  }

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
      onMedicationDeleted(idToDelete)
    }
  }

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-4">
        <div className="p-4 bg-muted/50 rounded-full">
          <Clock className="h-8 w-8 opacity-50" />
        </div>
        <p>Nessun farmaco ancora aggiunto.<br/>Clicca su "Aggiungi Farmaco" per iniziare.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Farmaco</TableHead>
          <TableHead>Dosaggio</TableHead>
          <TableHead>Ora (Locale)</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medications.map((med) => (
          <TableRow key={med.id}>
            <TableCell className="font-medium">{med.name}</TableCell>
            <TableCell>{med.dosage || '-'}</TableCell>
            
            {/* ✅ QUI USIAMO LA NUOVA FUNZIONE */}
            <TableCell className="font-mono font-medium">
              {formatLocalTime(med.time)}
            </TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleDeleteMedication(med.id)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Elimina
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}