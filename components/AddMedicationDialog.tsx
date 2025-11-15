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
import { Medication } from '@/lib/types/index';
import { Plus } from 'lucide-react'; // Icona "+"
import { toast } from "sonner"

// 🧠 CONCETTO REACT: "Props"
interface AddMedicationDialogProps {
  onAddMedication: (newMed: Omit<Medication, 'id'>) => void;
}

export const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  onAddMedication,
}) => {
  // State *interno* per gestire il form prima dell'invio
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Per chiudere il dialog dopo l'invio

  const handleSubmit = () => {
    if (!name || !time) {
      // 2. USA IL TOAST PER L'ERRORE
      toast.error("Errore", {
        description: "Nome e Ora sono obbligatori.",
      })
      return;
    }

    // Passiamo i dati al genitore (pagina)
    onAddMedication({ name, dosage, time });

    // 3. USA IL TOAST PER IL SUCCESSO!
    toast.success("Farmaco aggiunto!", {
      description: `"${name}" è stato aggiunto alla tua lista.`,
    })

    // Reset del form e chiusura
    setName('');
    setDosage('');
    setTime('');
    setIsOpen(false);
  };

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
          <Button type="submit" onClick={handleSubmit}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};