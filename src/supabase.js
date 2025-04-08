// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VUE_APP_SUPABASE_URL
const supabaseKey = import.meta.env.VUE_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials!')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
