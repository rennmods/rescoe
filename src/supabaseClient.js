// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://awgamuvxbrgwslprmlye.supabase.co' // Ganti dengan URL Anda
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2FtdXZ4YnJnd3NscHJtbHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjA3OTUsImV4cCI6MjA3NDYzNjc5NX0.zyqju8P51m4b4L7Kd8XN25chUj--m2HNR03lbXcUGl8' // Ganti dengan kunci anon Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey)