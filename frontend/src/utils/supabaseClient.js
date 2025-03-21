import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Error: Missing Supabase environment variables. Please check your .env file. ' +
    'See .env.example for required variables.'
  );
  
  // Log the current environment variables to help with debugging
  console.log('Current environment variables:', {
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'not set',
    REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'set but not shown' : 'not set',
  });
  
  // Use fallback values for development only
  // In a real production app, you'd want to handle this error more gracefully
  console.warn('Using fallback Supabase values for development ONLY');
}

// Create client with values or fallbacks (for development error handling)
const client = createClient(
  supabaseUrl || 'https://fzeahkzboymbbnemmeso.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6ZWFoa3pib3ltYmJuZW1tZXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDA3MDcsImV4cCI6MjA1ODExNjcwN30.L3ddaX0FPDdPS5jcnhzdjsCw5ijiPZmNppAT7Y-pXy8'
);

export default client; 