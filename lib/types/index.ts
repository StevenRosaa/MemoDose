export interface Medication {
  id: string; // Useremo un ID per poterlo eliminare
  name: string;
  dosage: string; // Es. "10mg", "1 compressa"
  time: string; // Es. "08:00"
}