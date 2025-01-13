import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrehoxfvnyjcfepmnxek.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZWhveGZ2bnlqY2ZlcG1ueGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2OTkxNzMsImV4cCI6MjA0ODI3NTE3M30.NTHmyX_p8QWHUNnmN4Jm7TDgWElPLAhXRmxTgM-nQjo'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
