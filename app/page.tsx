'use client' // 1. TRASFORMIAMO IN CLIENT COMPONENT

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider' // 2. Usiamo il context!
import { Medication } from '@/lib/types' // Assicurati che il percorso sia corretto
import { MedicationList } from '@/components/MedicationList'
import { AddMedicationDialog } from '@/components/AddMedicationDialog' // Importato
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { NotificationButton } from '@/components/NotificaButton'
import { TestNotificationButton } from '@/components/TestNotificationButton'

export default function DashboardPage() {
  const { session, supabase, isLoading } = useAuth() // 2. Prendiamo isLoading
  const router = useRouter()
  
  const [medications, setMedications] = useState<Medication[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true) // Caricamento dei farmaci

  useEffect(() => {
    // 3. 🛑 NON FARE NIENTE finché l'auth non è pronto
    if (isLoading) return; 

    // 4. Ora siamo sicuri. O è 'null' o è una 'session'.
    if (session === null) {
      router.push('/signin')
      return
    }

    // 5. Se siamo qui, l'utente è loggato. Carichiamo i dati.
    const fetchMedications = async () => {
      setIsDataLoading(true)
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('time', { ascending: true })

      if (error) {
        console.error('Error fetching medications:', error)
      } else {
        setMedications(data || [])
      }
      setIsDataLoading(false)
    }

    fetchMedications()
    
  }, [session, supabase, router, isLoading]) // 6. Aggiungiamo isLoading

  // 7. Mostriamo uno stato di caricamento per l'AUTH
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Verifica autenticazione...
      </div>
    )
  }

  // 8. Mostriamo la dashboard (o il caricamento dei farmaci)
  if (session) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          
          {/* ✅ REINSERITO IL COMPONENTE MANCANTE ✅ */}
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>I tuoi Farmaci</CardTitle>
            <AddMedicationDialog 
              onMedicationAdded={(newMed) => {
                setMedications((currentMeds) => [...currentMeds, newMed])
              }} 
            />
          </CardHeader>
          
          <CardContent>
            <div className="mb-4">
              <NotificationButton />
              <TestNotificationButton />
            </div>
            {isDataLoading ? (
              <div className="text-center p-8">Caricamento farmaci...</div>
            ) : (
              <MedicationList
                medications={medications}
                onMedicationDeleted={(deletedMedId) => {
                  setMedications((currentMeds) =>
                    currentMeds.filter((med) => med.id !== deletedMedId)
                  )
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // 9. Se la sessione è 'null', il redirect è già partito
  return null
}