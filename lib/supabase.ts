import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfbctxyociptylaafffe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYmN0eHlvY2lwdHlsYWFmZmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzI4MTAsImV4cCI6MjA2ODYwODgxMH0.vAT4BVkwxo5sjabi-tmXnnyxad2sR2I_d3hfIeMtVqY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
