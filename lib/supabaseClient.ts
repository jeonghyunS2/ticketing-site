// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseUrl = "https://jmvhypqxyibjuplsntov.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptdmh5cHF4eWlianVwbHNudG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MTcxMDIsImV4cCI6MjA3NDM5MzEwMn0.LHHuFNnwW17BBnX8VAoiXNZ5xHn07eS7nbBDhknSbHc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("Supabase client created:", supabase ? "Success" : "Failed");