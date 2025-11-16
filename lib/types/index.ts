// src/types/index.ts
export interface Medication {
  id: number; // In Supabase bigint, in JS è number
  created_at?: string; // Aggiunto da Supabase, opzionale
  user_id: string; // uuid in Supabase è string in JS
  name: string;
  dosage: string | null; // L'abbiamo reso opzionale nel DB
  time: string; // 'time' in Supabase è una stringa (es. "08:00:00")
}