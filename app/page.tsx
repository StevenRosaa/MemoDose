'use client'; // FONDAMENTALE: Questa pagina è interattiva (usa "state")

import React, { useState } from 'react';
import { MedicationList } from '@/components/MedicationList'; // Il nostro componente (passo 4)
import { AddMedicationDialog } from '@/components/AddMedicationDialog'; // Il nostro pop-up (passo 5)
import { Medication } from '@/lib/types'; // La nostra interfaccia
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Dati finti per iniziare (poi arriveranno da Supabase)
const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', name: 'Aspirina', dosage: '10mg', time: '08:00' },
  { id: '2', name: 'Cardio-Sermon', dosage: '1 compressa', time: '13:00' },
  { id: '3', name: 'Integratore Vitamina D', dosage: '5 gocce', time: '20:00' },
];

export default function DashboardPage() {
  // 🧠 CONCETTO REACT: "useState"
  // "useState" è un "gancio" (Hook) di React per dare "memoria" a un componente.
  // Qui, stiamo dicendo: "Voglio che questo componente si ricordi la lista dei farmaci".
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);

  // 🧠 CONCETTO REACT: "Passare Funzioni"
  // Definiamo le funzioni per aggiungere ed eliminare qui, nella pagina principale,
  // e poi le passiamo come "props" (accessori) ai componenti figli.

  const handleAddMedication = (newMed: Omit<Medication, 'id'>) => {
    // Creiamo un nuovo farmaco con un ID finto
    const medicationToAdd = {
      ...newMed,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Aggiorniamo lo "state", e React ridisegnerà la lista!
    setMedications((prevMeds) => [...prevMeds, medicationToAdd]);
    // Qui in futuro aggiungeremo la notifica "toast"
  };

  const handleDeleteMedication = (idToDelete: string) => {
    setMedications((prevMeds) =>
      prevMeds.filter((med) => med.id !== idToDelete)
    );
    // Qui in futuro aggiungeremo la notifica "toast"
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>I tuoi Farmaci</CardTitle>
          {/* Questo componente aprirà il pop-up */}
          <AddMedicationDialog onAddMedication={handleAddMedication} />
        </CardHeader>
        <CardContent>
          {/* Questo componente mostrerà la tabella */}
          <MedicationList
            medications={medications}
            onDeleteMedication={handleDeleteMedication}
          />
        </CardContent>
      </Card>
    </div>
  );
}