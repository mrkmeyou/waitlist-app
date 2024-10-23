import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ukqbtclxothzabuvpnqw.supabase.co'; // replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcWJ0Y2x4b3RoemFidXZwbnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2NjQzNDAsImV4cCI6MjA0NTI0MDM0MH0.2aDfkRKOpTdM3xisCNCHA5e4PBEFT2jAqi6nVFKDmw4'; // replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
