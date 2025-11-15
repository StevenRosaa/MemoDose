// src/components/MedicationList.tsx
import React from 'react';
import { Medication } from '@/lib/types/index';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react'; // Icona "..."

// 🧠 CONCETTO REACT: "Props"
// Definiamo cosa si aspetta di ricevere questo componente
interface MedicationListProps {
  medications: Medication[];
  onDeleteMedication: (id: string) => void; // Si aspetta una funzione per eliminare
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onDeleteMedication,
}) => {
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
            <TableCell className="font-medium">{med.name}</TableCell>
            <TableCell>{med.dosage}</TableCell>
            <TableCell>{med.time}</TableCell>
            <TableCell className="text-right">
              {/* Menu "..." per le azioni */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onDeleteMedication(med.id)}>
                    Elimina
                  </DropdownMenuItem>
                  {/* Potresti aggiungere "Modifica" qui in futuro */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};