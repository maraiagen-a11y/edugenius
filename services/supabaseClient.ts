import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Esta comprobación "calma" a TypeScript y evita errores rojos
if (!supabaseUrl || !supabaseKey) {
  throw new Error("⚠️ Faltan las claves VITE_SUPABASE en el archivo .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseKey)