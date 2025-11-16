import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        async getAll() {
          const allCookies = (await cookieStore).getAll()
          return allCookies;
        },

        async setAll(cookiesToSet) {
          try {
            const cookieStoreInstance = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStoreInstance.set(name, value, options)
            })
          } catch {
            // ...
          }
        },
      },
    },
  );
};